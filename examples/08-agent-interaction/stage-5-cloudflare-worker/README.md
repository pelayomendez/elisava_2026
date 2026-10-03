# Stage 5: Cloudflare Worker With D1

This stage takes the same Better Me Agent idea and moves it into the cloud.

Instead of running on your laptop, the agent runs as a Cloudflare Worker, stores its memory and run logs in Cloudflare D1, and can still send proactive reminders to Slack.

The default stage 5 setup is now **manual cloud API first**:

- deployed Worker
- deployed D1
- no automatic loop yet

You can add cron later once the apps are already connected.

## Goal

Turn the local background agent into a small deployed service:

1. the same coaching agent runs in Cloudflare Workers
2. memory is stored in D1 instead of local Markdown state
3. run logs are stored in D1 instead of local `RUN_LOG.md`
4. the apps can call the Worker over the internet
5. the result can optionally be posted to Slack

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
  cloudflare/
    package.json
    tsconfig.json
    wrangler.jsonc
    schema.sql
    .dev.vars.example
    src/
      contract.ts
      index.ts
```

## What is new compared to stage 4

- the agent no longer depends on FastAPI
- the runtime is implemented as a Cloudflare Worker
- memory is persisted in D1
- run history is persisted in D1
- the Worker is ready for app traffic from desktop or mobile
- Slack stays as the delivery channel

## Important teaching note

The `agent/` folder is still present because the exercise is still about the same agent contract.

At runtime, the Worker uses the TypeScript contract in `src/contract.ts`, because Cloudflare Workers cannot read your local Markdown files from disk after deployment.

So in stage 5:

- the Markdown files remain the human-readable contract
- `src/contract.ts` is the deployable copy of that contract

## Cloudflare pieces

This stage uses:

- **Workers** for the runtime
- **D1** for memory and run logs
- **Slack webhook** for proactive delivery

## Cloudflare setup tutorial

This is the recommended order for turning stage 5 into a real hosted backend.

### 1. Install dependencies

```bash
cd better-me-agent/cloudflare
npm install
```

### 2. Log into Cloudflare

Use the local project version of Wrangler with `npx`:

```bash
npx wrangler login
```

This opens a browser and connects Wrangler to your Cloudflare account.

### 3. Create the D1 database

```bash
npx wrangler d1 create better-me-agent-db
```

Cloudflare prints a `database_id`.

Copy that value into:

- `wrangler.jsonc`

Replace:

```txt
REPLACE_WITH_YOUR_D1_DATABASE_ID
```

with the real id from the command output.

## D1 schema

The Worker expects two tables:

- `user_memory`
- `run_logs`

### 4. Initialize the database schema

For local development:

```bash
npx wrangler d1 execute better-me-agent-db --local --file=./schema.sql
```

For the real deployed database:

```bash
npx wrangler d1 execute better-me-agent-db --remote --file=./schema.sql
```

Use:

- `--local` for `wrangler dev`
- `--remote` for the deployed cloud database

## Environment and secrets

### 5. Configure local development secrets

Copy the example file:

```bash
cp .dev.vars.example .dev.vars
```

For local development, put values like these into `.dev.vars`:

```txt
MISTRAL_API_KEY=
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 6. Configure production secrets in Cloudflare

Set production secrets with:

```bash
npx wrangler secret put MISTRAL_API_KEY
npx wrangler secret put SLACK_WEBHOOK_URL
```

## Run locally

### 7. Run the Worker locally

```bash
cd better-me-agent/cloudflare
npx wrangler dev
```

Open the local Worker:

```txt
http://localhost:8787
```

If you want phones or other devices on your Wi-Fi to reach your local Worker, use:

```bash
npx wrangler dev --host 0.0.0.0
```

## Local endpoints

This Worker exposes:

- `GET /health`
- `GET /agent/memory`
- `GET /agent/runs`
- `POST /agent/run`
- `POST /agent/notify`

## Test the Worker

Health check:

```bash
curl http://localhost:8787/health
```

Manual run:

```bash
curl -X POST http://localhost:8787/agent/run \
  -H "Content-Type: application/json" \
  -d '{"message":"I forgot to drink water yesterday"}'
```

Manual Slack reminder:

```bash
curl -X POST http://localhost:8787/agent/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Send me a small habit reminder for this afternoon"}'
```

Inspect stored memory:

```bash
curl http://localhost:8787/agent/memory
```

Inspect recent runs:

```bash
curl http://localhost:8787/agent/runs
```

## Test the scheduled handler locally

Cloudflare exposes a local route for scheduled events:

```bash
curl "http://localhost:8787/cdn-cgi/handler/scheduled"
```

That simulates the cron-triggered reminder run.

## Deploy

### 8. Deploy the Worker to Cloudflare

```bash
npx wrangler deploy
```

After deployment, Cloudflare gives you a real public Worker URL, for example:

```txt
https://better-me-agent-worker.<your-subdomain>.workers.dev
```

That is the URL your stage 6 apps should use.

In this project, a real deployed example looked like:

```txt
https://better-me-agent-worker.mf-pelayo.workers.dev
```

### 9. Point the apps at the deployed Worker

Desktop app:

```txt
VITE_AGENT_BASE_URL=https://better-me-agent-worker.<your-subdomain>.workers.dev
```

Mobile app:

```txt
EXPO_PUBLIC_AGENT_BASE_URL=https://better-me-agent-worker.<your-subdomain>.workers.dev
```

After changing those env values, restart the app dev servers.

## Test the deployed Worker

Once the Worker is deployed, test the real cloud endpoint directly.

Health check:

```bash
curl https://better-me-agent-worker.mf-pelayo.workers.dev/health
```

Manual run:

```bash
curl -X POST https://better-me-agent-worker.mf-pelayo.workers.dev/agent/run \
  -H "Content-Type: application/json" \
  -d '{"message":"I forgot to drink water yesterday"}'
```

Example successful response:

```json
{
  "answer": "**Today’s Challenge:** Set a phone reminder to drink one glass of water every 2 hours—just 3 sips at a time counts!\n\n**Motivation:** Small sips add up! You’ve got this—hydration helps sleep too.\n\n**Question:** Want me to tweak the reminder times to fit your schedule?",
  "model": "mistral-medium-latest"
}
```

That confirms:

- the Worker is live on Cloudflare
- the deployed Worker can reach the model
- the API contract used by stage 6 is working

## Add the loop later

The Worker code already includes a `scheduled()` handler, but the default config does not enable it yet.

This is intentional.

For the first setup, it is easier to deploy a normal hosted API backend and connect the apps first.

After the apps are working, you can turn the automatic loop back on.

When you want the loop later, add this back into `wrangler.jsonc`:

```json
"triggers": {
  "crons": ["*/5 * * * *"]
}
```

That will make Cloudflare call the Worker every 5 minutes in production.

Examples:

- every 5 minutes: `*/5 * * * *`
- every 10 minutes: `*/10 * * * *`
- every hour: `0 * * * *`

Important:

- Cloudflare cron uses UTC time
- local `wrangler dev` does not auto-run cron
- local cron testing uses:

```bash
curl "http://localhost:8787/cdn-cgi/handler/scheduled"
```

## Fast setup summary

If you just want the shortest happy path:

```bash
cd better-me-agent/cloudflare
npm install
npx wrangler login
npx wrangler d1 create better-me-agent-db
```

Then:

1. paste the `database_id` into `wrangler.jsonc`
2. run:

```bash
npx wrangler d1 execute better-me-agent-db --remote --file=./schema.sql
npx wrangler secret put MISTRAL_API_KEY
npx wrangler secret put SLACK_WEBHOOK_URL
npx wrangler deploy
```

3. copy the `workers.dev` URL into the stage 6 app env files

## Notes

- If `MISTRAL_API_KEY` is missing, the Worker still responds with a local fallback answer.
- If `SLACK_WEBHOOK_URL` is missing, the run is still stored in D1 and the response tells you Slack was skipped.
- Stage 5 is the cloud version of stage 4, not a replacement for stage 3.
- This stage is meant to show how the same agent contract can move from local files to a deployed platform.
- The cron loop is intentionally disabled by default so stage 6 can connect to a simpler deployed backend first.

## What to learn

Stage 5 shows how an agent evolves again:

- same coaching contract
- same prompt-building idea
- same backend behavior
- but now with cloud runtime and cloud database, ready to power the final apps
