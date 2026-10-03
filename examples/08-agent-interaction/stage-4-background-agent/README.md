# Stage 4: Background Agent With Slack

This stage evolves the stage 2 backend into a **background habit coach** that can run on a schedule and send proactive reminders to Slack.

This is a strong classroom version because:

- the agent runs on a schedule
- generates a proactive reminder
- appends the result to `RUN_LOG.md`
- sends the message to Slack
- the Slack desktop app can show the local notification on macOS

## Two processes

Stage 4 has **two different ways to run**:

1. `uvicorn main:app --reload --port 8000`
   This runs the API server for manual testing.
2. `python background_agent.py ...`
   This runs the scheduled worker that actually sends reminders over time.

So:

- `uvicorn` does **not** send reminders every 5 minutes by itself
- the timed behavior comes from `background_agent.py`

## Goal

Turn the Better Me Agent into a small background assistant.

Instead of waiting for the user to open a UI, the agent can:

1. wake up automatically
2. generate a coaching message
3. log the run
4. post the result into Slack

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
    main.py
    agent_runtime.py
    notifier.py
    background_agent.py
    requirements.txt
    .env.example
    launchd/
      com.betterme.agent.plist.template
```

## What is new compared to stage 2

- the backend still reads the Markdown contract
- the runtime still appends to `RUN_LOG.md`
- a background loop runs the agent on a schedule
- a Slack notifier sends the result to a real channel
- a `launchd` template is included for macOS background execution

## API endpoints

The stage 4 backend exposes:

- `GET /health`
- `POST /agent/run`
- `POST /agent/notify`
- `GET /agent/background/status`

## Environment variables

Set your Slack configuration in `.env`:

```txt
MISTRAL_API_KEY=
MISTRAL_MODEL=mistral-medium-latest
BETTER_ME_SLACK_SUBJECT=Better Me Agent Reminder
BETTER_ME_BACKGROUND_MESSAGE=Create today's proactive habit reminder for the user.
BETTER_ME_DEFAULT_INTERVAL_SECONDS=3600
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_CHANNEL=#better-me-agent
SLACK_BOT_NAME=Better Me Agent
```

## Run the backend

```bash
cd better-me-agent/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Use this only for:

- testing `/agent/run`
- testing `/agent/notify`
- checking `/agent/background/status`

## Test the normal agent

```bash
curl -X POST http://localhost:8000/agent/run \
  -H "Content-Type: application/json" \
  -d '{"message":"I forgot to drink water yesterday"}'
```

## Test a Slack reminder

This triggers the agent and sends the answer to Slack.

```bash
curl -X POST http://localhost:8000/agent/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Send me a small habit reminder for this afternoon"}'
```

The response also tells you whether the Slack post succeeded.

## Run the background agent once

This is the easiest classroom demo:

```bash
cd better-me-agent/backend
source .venv/bin/activate
python background_agent.py --once
```

## Run the background loop

Quick demo:

```bash
python background_agent.py --interval-seconds 30
```

Every 5 minutes:

```bash
python background_agent.py --interval-seconds 300
```

More realistic reminder cadence:

```bash
python background_agent.py --interval-minutes 60
```

If you want the reminders to continue, keep this worker process running in its own terminal.

## Recommended classroom workflow

Terminal 1:

```bash
cd better-me-agent/backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

Terminal 2:

```bash
cd better-me-agent/backend
source .venv/bin/activate
python background_agent.py --interval-seconds 300
```

This gives you:

- an API you can test manually
- a real scheduled worker that posts to Slack every 5 minutes

## Background status

The worker writes its latest activity to a local status file.

Check it with:

```bash
curl http://localhost:8000/agent/background/status
```

## Optional macOS `launchd` setup

This stage includes:

```txt
backend/launchd/com.betterme.agent.plist.template
```

You can use it as a starting point for a user LaunchAgent.

The template is set up in the macOS-friendly way:

- `launchd` wakes up every 300 seconds
- it runs `background_agent.py --once`
- the script exits
- `launchd` runs it again on the next interval

This is usually better than keeping one infinite Python loop alive forever.

Typical flow:

1. copy the template
2. replace the placeholder paths
3. load it with `launchctl`

Example:

```bash
cp launchd/com.betterme.agent.plist.template ~/Library/LaunchAgents/com.betterme.agent.plist
launchctl load ~/Library/LaunchAgents/com.betterme.agent.plist
```

For a real setup, edit the file first so:

- the Python path is correct
- the project path is correct
- the interval matches what you want

Useful commands:

```bash
launchctl unload ~/Library/LaunchAgents/com.betterme.agent.plist
launchctl load ~/Library/LaunchAgents/com.betterme.agent.plist
launchctl list | grep betterme
```

## Notes

- This stage is intentionally based on stage 2, not stage 3.
- If `MISTRAL_API_KEY` is missing, the agent still runs with the local fallback response.
- If `SLACK_WEBHOOK_URL` is missing or invalid, the run is still logged and the error is returned in the API response.
- If Slack desktop is installed and notifications are enabled, Slack can provide the local notification experience on macOS.
- For quick testing, `python background_agent.py --interval-seconds 300` is the easiest way to get reminders every 5 minutes.

## What to learn

Stage 4 shows that an agent can become a **background service**:

- same contract files
- same runtime idea
- same logging
- but now with proactive scheduled behavior and a simple delivery channel

Stage 5 keeps the same proactive pattern but moves it into a Cloudflare Worker with D1-backed state.
