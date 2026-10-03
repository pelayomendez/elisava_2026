# Stage 3: CopilotKit Runtime

This stage adds a **real CopilotKit connection** and includes the UI.

## Goal

Run a frontend that connects to a live AG-UI endpoint so CopilotKit can talk to the agent runtime without `404` errors.

This stage is the final integrated **interactive app** version of the exercise.

After this, stage 4 explores a different direction: running the agent as a background local process with notifications. Stage 5 then takes that same proactive idea into Cloudflare with D1 storage.

## Important requirement

This stage uses `ag-ui-langgraph`, which requires **Python 3.10+**.

If your default `python3` is 3.9, use `python3.10` or `python3.11` for this stage.

## Folder

```txt
better-me-agent/
  agent/
    AGENTS.md
    TASK.md
    MEMORY.md
    TOOLS.md
    EVALS.md
    RUN_LOG.md
  backend/
    app.py
    graph.py
    requirements.txt
    .env.example
  frontend/
    index.html
    package.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      styles.css
      components/
        ChallengeCard.tsx
        ProgressPanel.tsx
```

## Architecture

The stage uses:

- **Frontend**: React + Vite + CopilotKit UI
- **Backend**: FastAPI + LangGraph + AG-UI endpoint
- **Model**: Mistral via `langchain-mistralai`

The connection flow is:

```txt
CopilotKit frontend
-> http://localhost:8001/copilotkit
-> FastAPI AG-UI endpoint
-> LangGraph agent
-> Mistral model
```

This stage uses the CopilotKit `single` transport mode, so the frontend talks to one runtime endpoint and first sends an `info` probe before starting the agent run.

## Run the backend

```bash
cd better-me-agent/backend
python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app:app --reload --port 8001
```

Any Python `3.10+` version is fine here.

## Run the frontend demo

```bash
cd better-me-agent/frontend
npm install
npm run dev
```

Open:

```txt
http://localhost:5174
```

## What the backend does

1. Reads all files from `agent/`
2. Builds a coaching system prompt
3. Runs a LangGraph message workflow
4. Exposes the workflow through an AG-UI FastAPI endpoint at `/copilotkit`
5. Appends each interaction to `RUN_LOG.md`

## What the frontend does

1. Wraps the app in `CopilotKit`
2. Connects to `http://localhost:8001/copilotkit`
3. Opens a `CopilotSidebar`
4. Shows a local challenge card and progress panel
5. Exposes CopilotKit frontend actions for future UI-aware agent behavior

## Notes

- This stage is the one to use if you specifically want a **real CopilotKit runtime connection**.
- The frontend actions are exposed, but whether the model chooses to call them depends on the conversation and runtime behavior.

## Suggested test

Try:

```txt
I forgot to drink water yesterday.
```

You should see the CopilotKit sidebar connect to the backend and stream the agent response instead of failing on `/api/copilotkit`.
