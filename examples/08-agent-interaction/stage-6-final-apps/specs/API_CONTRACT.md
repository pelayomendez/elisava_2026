# API Contract

All client apps should talk only to the stage 5 Cloudflare Worker.

They should not connect directly to D1.

## Base URL

Examples:

- local: `http://localhost:8787`
- deployed: `https://better-me-agent-worker.<subdomain>.workers.dev`

## Endpoints

### `GET /health`

Returns:

```json
{
  "status": "ok",
  "mode": "cloudflare-worker",
  "storage": "d1"
}
```

### `GET /agent/memory`

Returns:

```json
{
  "memory": [
    "User wants to sleep better.",
    "User struggles drinking enough water."
  ]
}
```

### `GET /agent/runs`

Optional query:

- `?limit=10`

Returns:

```json
{
  "runs": [
    {
      "id": 12,
      "created_at": "2026-05-15T10:20:00.000Z",
      "trigger_mode": "scheduled",
      "message": "Create today's proactive habit reminder for the user.",
      "answer": "Today's challenge: ...",
      "model": "mistral-medium-latest",
      "slack_sent": 1,
      "slack_detail": "Slack message sent successfully."
    }
  ]
}
```

### `POST /agent/run`

Request:

```json
{
  "message": "I forgot to drink water yesterday"
}
```

Response:

```json
{
  "answer": "Today's challenge: ...",
  "model": "mistral-medium-latest"
}
```

### `POST /agent/notify`

Request:

```json
{
  "message": "Send me a small habit reminder for this afternoon"
}
```

Response:

```json
{
  "answer": "Today's challenge: ...",
  "model": "mistral-medium-latest",
  "slack_sent": true,
  "slack_detail": "Slack message sent successfully."
}
```

## Client rule

The frontend should treat the Worker as the only source of truth for:

- memory
- run history
- manual runs
- triggered reminders
