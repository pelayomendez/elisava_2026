# Better Me Agent Exercise

This workspace is split into six clear stages so the exercise can be tested incrementally and later rebuilt from scratch:

1. `stage-1-agent-contract`
2. `stage-2-runnable-backend`
3. `stage-3-copilotkit-runtime`
4. `stage-4-background-agent`
5. `stage-5-cloudflare-worker`
6. `stage-6-final-apps`

Each stage has its own `README.md` with goals, files, run steps, and what to learn from that phase.

There is also a presentation-friendly static documentation site in:

- [class-docs/index.html](/Users/pomf/Experimental/elisava_temp/agent-interaction/class-docs/index.html)

## What each stage does

- `stage-1-agent-contract`
  Defines the agent contract in Markdown files only.
- `stage-2-runnable-backend`
  Adds a FastAPI backend that reads the Markdown files, builds a prompt, calls Mistral AI, and writes to `RUN_LOG.md`.
- `stage-3-copilotkit-runtime`
  Adds the final integrated app with the CopilotKit-compatible runtime, backend, and UI.
- `stage-4-background-agent`
  Evolves the stage 2 backend into a background coach that sends proactive reminders to Slack.
- `stage-5-cloudflare-worker`
  Moves the same agent into a Cloudflare Worker with D1-backed memory and run logs.
- `stage-6-final-apps`
  Builds the simplest user-facing React desktop and React Native apps on top of the Cloudflare agent.

## Run the backend

Use the stage 2 backend if you want to test the agent runtime by itself:

```bash
cd stage-2-runnable-backend/better-me-agent/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend exposes:

- `GET /health`
- `POST /agent/run`

## Test the backend

Health check:

```bash
curl http://localhost:8000/health
```

Run the agent:

```bash
curl -X POST http://localhost:8000/agent/run \
  -H "Content-Type: application/json" \
  -d '{"message":"I forgot to drink water yesterday"}'
```

## Run the stage 3 CopilotKit runtime

Use stage 3 if you want a real CopilotKit runtime connection.

Backend:

```bash
cd stage-3-copilotkit-runtime/better-me-agent/backend
python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app:app --reload --port 8001
```

Frontend:

```bash
cd stage-3-copilotkit-runtime/better-me-agent/frontend
npm install
npm run dev
```

Open:

```txt
http://localhost:5174
```

You can use any Python version from `3.10` upward for this stage.

## Suggested learning order

1. Read stage 1 to understand the agent contract.
2. Run stage 2 and test the backend with `curl`.
3. Run stage 3 to use the full CopilotKit-connected app.
4. Run stage 4 to see the agent behave like a local background assistant.
5. Run stage 5 to deploy the same idea to Cloudflare with D1 storage.
6. Run stage 6 to see the final user app layer built on top of the cloud agent.

## Run the stage 4 background agent

Use stage 4 if you want the agent to run on a schedule and send Slack reminders.

Backend:

```bash
cd stage-4-background-agent/better-me-agent/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Manual notification test:

```bash
curl -X POST http://localhost:8000/agent/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Send me a small habit reminder for this afternoon"}'
```

Background loop:

```bash
cd stage-4-background-agent/better-me-agent/backend
source .venv/bin/activate
python background_agent.py --interval-seconds 30
```

## Run the stage 5 Cloudflare Worker

Use stage 5 if you want the same agent to run in Cloudflare and store state in D1.

```bash
cd stage-5-cloudflare-worker/better-me-agent/cloudflare
npm install
npx wrangler login
npx wrangler d1 create better-me-agent-db
```

Paste the printed `database_id` into `wrangler.jsonc`, then initialize the schema:

```bash
npx wrangler d1 execute better-me-agent-db --remote --file=./schema.sql
cp .dev.vars.example .dev.vars
npx wrangler secret put MISTRAL_API_KEY
npx wrangler secret put SLACK_WEBHOOK_URL
npx wrangler deploy
```

For local Worker testing:

```bash
cp .dev.vars.example .dev.vars
npx wrangler d1 execute better-me-agent-db --local --file=./schema.sql
npx wrangler dev
```

Manual test:

```bash
curl -X POST http://localhost:8787/agent/run \
  -H "Content-Type: application/json" \
  -d '{"message":"I forgot to drink water yesterday"}'
```

## Run the stage 6 final apps

Use stage 6 if you want the simplest end-user apps on top of the stage 5 backend.

Desktop app:

```bash
cd stage-6-final-apps/desktop-react-app
npm install
cp .env.example .env
npm run dev
```

Mobile app:

```bash
cd stage-6-final-apps/mobile-react-native-app
npm install
cp .env.example .env
npx expo start
```

## Stage READMEs

- [Stage 1 README](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-1-agent-contract/README.md)
- [Stage 2 README](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-2-runnable-backend/README.md)
- [Stage 3 README](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-3-copilotkit-runtime/README.md)
- [Stage 4 README](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-4-background-agent/README.md)
- [Stage 5 README](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-5-cloudflare-worker/README.md)
- [Stage 6 README](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-6-final-apps/README.md)
