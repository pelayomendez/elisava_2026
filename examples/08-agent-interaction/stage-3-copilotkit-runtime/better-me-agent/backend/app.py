import asyncio

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ag_ui.core import (
    CustomEvent,
    RunAgentInput,
    StepFinishedEvent,
    StepStartedEvent,
    ThinkingEndEvent,
    ThinkingStartEvent,
    ThinkingTextMessageContentEvent,
    ThinkingTextMessageEndEvent,
    ThinkingTextMessageStartEvent,
)
from ag_ui.encoder import EventEncoder

from graph import agent


app = FastAPI(title="Better Me CopilotKit Runtime")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/copilotkit/info")
def copilotkit_info() -> dict:
    return {
        "version": "stage-3-demo",
        "mode": "sse",
        "agents": {
            "default": {
                "description": agent.description or agent.name,
                "capabilities": {},
            }
        },
    }


@app.get("/copilotkit/health")
def copilotkit_health() -> dict:
    return {
        "status": "ok",
        "agent": {
            "name": agent.name,
        },
    }


@app.get("/copilotkit/threads")
def copilotkit_threads() -> dict:
    return {
        "threads": [],
        "nextCursor": None,
    }


@app.post("/copilotkit")
async def copilotkit_single_endpoint(request: Request):
    payload = await request.json()
    method = payload.get("method")

    if method == "info":
        return copilotkit_info()

    if method not in {"agent/run", "agent/connect"}:
        return {
            "error": f"Unsupported method: {method}",
        }

    body = payload.get("body", {})
    run_input = RunAgentInput.model_validate(body)
    accept_header = request.headers.get("accept")
    encoder = EventEncoder(accept=accept_header)
    request_agent = agent.clone()

    async def event_generator():
        saw_run_started = False

        async for event in request_agent.run(run_input):
            yield encoder.encode(event)

            if not saw_run_started and getattr(event, "type", None) == "RUN_STARTED":
                saw_run_started = True

                # Small mocked prelude to showcase richer agent activity in CopilotKit.
                prelude_events = [
                    StepStartedEvent(step_name="review_context"),
                    ThinkingStartEvent(title="Reviewing memory"),
                    ThinkingTextMessageStartEvent(),
                    ThinkingTextMessageContentEvent(
                        delta="Checking the user's recent habit history and preferences.",
                    ),
                    ThinkingTextMessageContentEvent(
                        delta=" Looking for a challenge that is short, realistic, and supportive.",
                    ),
                    ThinkingTextMessageEndEvent(),
                    CustomEvent(
                        name="coach_status",
                        value={
                            "label": "Drafting a personalized challenge",
                        },
                    ),
                    ThinkingEndEvent(),
                    StepFinishedEvent(step_name="review_context"),
                ]

                for prelude_event in prelude_events:
                    yield encoder.encode(prelude_event)
                    await asyncio.sleep(0.08)

    return StreamingResponse(
        event_generator(),
        media_type=encoder.get_content_type(),
    )
