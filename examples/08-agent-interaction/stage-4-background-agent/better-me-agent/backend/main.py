from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel

from agent_runtime import BetterMeRuntime
from notifier import SlackNotifier


BASE_DIR = Path(__file__).resolve().parent
AGENT_DIR = BASE_DIR.parent / "agent"
STATUS_PATH = BASE_DIR / "background_status.json"

app = FastAPI(title="Better Me Background Agent API")
runtime = BetterMeRuntime(AGENT_DIR, status_path=STATUS_PATH)
notifier = SlackNotifier()


class AgentRunRequest(BaseModel):
    message: str


class AgentRunResponse(BaseModel):
    answer: str


class AgentNotifyResponse(BaseModel):
    answer: str
    slack_sent: bool
    slack_method: str
    slack_detail: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "background-ready"}


@app.get("/agent/background/status")
def background_status() -> dict:
    return runtime.read_background_status()


@app.post("/agent/run", response_model=AgentRunResponse)
def run_agent(payload: AgentRunRequest) -> AgentRunResponse:
    answer = runtime.run(payload.message)
    return AgentRunResponse(answer=answer)


@app.post("/agent/notify", response_model=AgentNotifyResponse)
def notify_agent(payload: AgentRunRequest) -> AgentNotifyResponse:
    answer = runtime.run(payload.message)
    notification_result = notifier.send(
        subject=runtime.slack_subject,
        message=answer,
    )
    return AgentNotifyResponse(
        answer=answer,
        slack_sent=notification_result.sent,
        slack_method=notification_result.method,
        slack_detail=notification_result.detail,
    )
