from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import json
import os

from dotenv import load_dotenv

try:
    from mistralai import Mistral
except ImportError:
    from mistralai.client import Mistral


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
    def __init__(self, agent_dir: Path, status_path: Path | None = None) -> None:
        self.agent_dir = agent_dir
        self.status_path = status_path or agent_dir.parent / "background_status.json"
        self.model = os.getenv("MISTRAL_MODEL", "mistral-medium-latest")
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.client = Mistral(api_key=self.api_key) if self.api_key else None
        self.slack_subject = os.getenv(
            "BETTER_ME_SLACK_SUBJECT",
            "Better Me Agent Reminder",
        )
        self.background_message = os.getenv(
            "BETTER_ME_BACKGROUND_MESSAGE",
            "Create today's proactive habit reminder for the user.",
        )

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

    def run_background_cycle(self, message: str | None = None) -> str:
        cycle_message = message or self.background_message
        answer = self.run(cycle_message)
        self.write_background_status(
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "last_message": cycle_message,
                "last_answer": answer,
                "last_mode": "background",
            }
        )
        return answer

    def read_background_status(self) -> dict:
        if not self.status_path.exists():
            return {
                "status": "idle",
                "detail": "No background run has been recorded yet.",
            }

        try:
            return json.loads(self.status_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {
                "status": "error",
                "detail": "Background status file could not be parsed.",
            }

    def write_background_status(self, payload: dict) -> None:
        payload = {
            "status": "ok",
            **payload,
        }
        self.status_path.write_text(
            json.dumps(payload, indent=2),
            encoding="utf-8",
        )

    def _call_model(self, prompt: str, message: str) -> str:
        if not self.client:
            return self._fallback_answer(message)

        try:
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
        except Exception:
            return self._fallback_answer(message)

    def _fallback_answer(self, message: str) -> str:
        lowered = message.lower()
        if "water" in lowered or "drink" in lowered:
            return (
                "No problem. Today try one glass after breakfast and one before dinner. "
                "What time do you usually start work?"
            )
        if "sleep" in lowered:
            return (
                "Tonight try a 10-minute wind-down before bed. "
                "What time would feel realistic for that?"
            )
        if "proactive" in lowered or "today" in lowered or "reminder" in lowered:
            return (
                "Today's challenge: take a 10-minute walk and drink one glass of water "
                "right after it. What part of the day fits best?"
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
