from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel

from agent_runtime import BetterMeRuntime


BASE_DIR = Path(__file__).resolve().parent
AGENT_DIR = BASE_DIR.parent / "agent"

app = FastAPI(title="Better Me Agent API")
runtime = BetterMeRuntime(AGENT_DIR)


class AgentRunRequest(BaseModel):
    message: str


class AgentRunResponse(BaseModel):
    answer: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/agent/run", response_model=AgentRunResponse)
def run_agent(payload: AgentRunRequest) -> AgentRunResponse:
    answer = runtime.run(payload.message)
    return AgentRunResponse(answer=answer)
