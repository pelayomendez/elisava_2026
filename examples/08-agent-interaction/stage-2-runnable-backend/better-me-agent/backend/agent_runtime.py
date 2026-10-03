from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import json
import os

from dotenv import load_dotenv
from mistralai import Mistral


load_dotenv()


PROMPT_TEMPLATE = """You are running an agent from local Markdown files.

Instructions:
{agents}

Task:
{task}

Memory:
{memory}

Allowed tools:
{tools}

Evaluation:
{evals}

User message:
{message}

Return only the final user-facing answer.
"""


@dataclass
class AgentFiles:
    agents: str
    task: str
    memory: str
    tools: str
    evals: str
    run_log_path: Path


class BetterMeRuntime:
    def __init__(self, agent_dir: Path) -> None:
        self.agent_dir = agent_dir
        self.model = os.getenv("MISTRAL_MODEL", "mistral-medium-latest")
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.client = Mistral(api_key=self.api_key) if self.api_key else None

    def read_agent_files(self) -> AgentFiles:
        return AgentFiles(
            agents=(self.agent_dir / "AGENTS.md").read_text(encoding="utf-8"),
            task=(self.agent_dir / "TASK.md").read_text(encoding="utf-8"),
            memory=(self.agent_dir / "MEMORY.md").read_text(encoding="utf-8"),
            tools=(self.agent_dir / "TOOLS.md").read_text(encoding="utf-8"),
            evals=(self.agent_dir / "EVALS.md").read_text(encoding="utf-8"),
            run_log_path=self.agent_dir / "RUN_LOG.md",
        )

    def build_prompt(self, message: str, files: AgentFiles) -> str:
        return PROMPT_TEMPLATE.format(
            agents=files.agents,
            task=files.task,
            memory=files.memory,
            tools=files.tools,
            evals=files.evals,
            message=message,
        )

    def run(self, message: str) -> str:
        files = self.read_agent_files()
        prompt = self.build_prompt(message, files)
        answer = self._call_model(prompt, message)
        self._append_run_log(files.run_log_path, message, answer)
        return answer

    def _call_model(self, prompt: str, message: str) -> str:
        if not self.client:
            return self._fallback_answer(message)

        response = self.client.chat.complete(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )
        content = response.choices[0].message.content
        return str(content).strip()

    def _fallback_answer(self, message: str) -> str:
        lowered = message.lower()
        if "water" in lowered or "drink" in lowered:
            return (
                "No problem. Today try drinking one glass after breakfast "
                "and one before dinner. What time do you usually start work?"
            )
        if "sleep" in lowered:
            return (
                "That is okay. Tonight try a 10-minute wind-down without your phone. "
                "What time would feel realistic for that?"
            )
        return (
            "Small steps count. Today try a 10-minute walk or stretch break. "
            "What part of your day feels easiest for that?"
        )

    def _append_run_log(self, run_log_path: Path, message: str, answer: str) -> None:
        timestamp = datetime.now(timezone.utc).isoformat()
        entry = {
            "timestamp": timestamp,
            "message": message,
            "answer": answer,
            "model": self.model if self.client else "fallback-local-template",
        }
        with run_log_path.open("a", encoding="utf-8") as handle:
            handle.write("\n\n")
            handle.write(f"## Run {timestamp}\n\n")
            handle.write("```json\n")
            handle.write(json.dumps(entry, indent=2))
            handle.write("\n```\n")
