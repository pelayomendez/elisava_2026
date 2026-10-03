# Stage 2: Runnable Backend Agent

This stage turns the Markdown contract into a working backend.

## Goal

Run a FastAPI server that:

1. Reads the agent contract files from `agent/`
2. Builds one prompt
3. Calls Mistral AI when `MISTRAL_API_KEY` is available
4. Returns the final answer
5. Appends a new entry to `RUN_LOG.md`

## Folder

```txt
better-me-agent/
  backend/
    main.py
    agent_runtime.py
    requirements.txt
    .env.example
  agent/
    AGENTS.md
    TASK.md
    MEMORY.md
    TOOLS.md
    EVALS.md
    RUN_LOG.md
```

## Run

```bash
cd better-me-agent/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

## Test

```bash
curl -X POST http://localhost:8000/agent/run \
  -H "Content-Type: application/json" \
  -d '{"message":"I forgot to drink water yesterday"}'
```

## Notes

- If `MISTRAL_API_KEY` is missing, the backend falls back to a deterministic local response so the exercise still runs in class.
- With an API key present, it uses the official `mistralai` Python SDK and the prompt template from the exercise.
- The default model is `mistral-medium-latest`, which is a good fit for a lightweight coaching exercise.

## What to learn

Markdown files become executable when the runtime reads them, assembles a prompt, and records what happened.
