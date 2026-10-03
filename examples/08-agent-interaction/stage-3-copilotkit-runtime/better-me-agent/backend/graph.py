from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import json
import os

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, SystemMessage
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.checkpoint.memory import MemorySaver
from langchain_mistralai import ChatMistralAI
from ag_ui_langgraph import LangGraphAgent


load_dotenv()


BASE_DIR = Path(__file__).resolve().parent
AGENT_DIR = BASE_DIR.parent / "agent"


def _read_text(name: str) -> str:
    return (AGENT_DIR / name).read_text(encoding="utf-8")


def build_system_prompt() -> str:
    agents = _read_text("AGENTS.md")
    task = _read_text("TASK.md")
    memory = _read_text("MEMORY.md")
    tools = _read_text("TOOLS.md")
    evals = _read_text("EVALS.md")

    return f"""You are running an agent from local Markdown files.

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

Return a short final answer for the user that includes:
- one realistic daily habit challenge
- one short motivational message
- one follow-up question

Keep the answer short and friendly.
Avoid medical advice.
"""


def append_run_log(user_message: str, answer: str) -> None:
    run_log_path = AGENT_DIR / "RUN_LOG.md"
    timestamp = datetime.now(timezone.utc).isoformat()
    entry = {
        "timestamp": timestamp,
        "message": user_message,
        "answer": answer,
        "model": os.getenv("MISTRAL_MODEL", "mistral-medium-latest"),
    }

    with run_log_path.open("a", encoding="utf-8") as handle:
        handle.write("\n\n")
        handle.write(f"## Run {timestamp}\n\n")
        handle.write("```json\n")
        handle.write(json.dumps(entry, indent=2))
        handle.write("\n```\n")


def fallback_answer(user_message: str) -> str:
    lowered = user_message.lower()
    if "water" in lowered or "drink" in lowered:
        return (
            "No problem. Today try one glass after breakfast and one before dinner. "
            "What time do you usually start work?"
        )
    if "sleep" in lowered:
        return (
            "That is okay. Tonight try a 10-minute screen-free wind-down before bed. "
            "What bedtime feels realistic tonight?"
        )
    return (
        "Small steps count. Today try a 10-minute walk or stretch break. "
        "What part of your day feels easiest for that?"
    )


def build_graph():
    api_key = os.getenv("MISTRAL_API_KEY")
    llm = (
        ChatMistralAI(
            model=os.getenv("MISTRAL_MODEL", "mistral-medium-latest"),
            temperature=0.4,
            api_key=api_key,
        )
        if api_key
        else None
    )
    system_prompt = build_system_prompt()

    def coach_node(state: MessagesState) -> dict[str, list[AIMessage]]:
        user_message = ""
        for message in reversed(state["messages"]):
            content = getattr(message, "content", "")
            if isinstance(content, str) and content.strip():
                user_message = content
                break

        if llm is None:
            answer_text = fallback_answer(user_message)
            response = AIMessage(content=answer_text)
            append_run_log(user_message, answer_text)
            return {"messages": [response]}

        try:
            response = llm.invoke(
                [SystemMessage(content=system_prompt), *state["messages"]]
            )
        except Exception:
            answer_text = fallback_answer(user_message)
            response = AIMessage(content=answer_text)
            append_run_log(user_message, answer_text)
            return {"messages": [response]}

        answer_text = response.content if isinstance(response.content, str) else str(response.content)
        append_run_log(user_message, answer_text)
        return {"messages": [response]}

    workflow = StateGraph(MessagesState)
    workflow.add_node("coach", coach_node)
    workflow.add_edge(START, "coach")
    workflow.add_edge("coach", END)
    checkpointer = MemorySaver()
    return workflow.compile(checkpointer=checkpointer)


graph = build_graph()

agent = LangGraphAgent(
    name="default",
    description="Supportive daily habit coach",
    graph=graph,
)
