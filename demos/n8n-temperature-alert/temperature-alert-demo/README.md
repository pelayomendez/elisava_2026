# Temperature Alert Demo

Local classroom demo with an Astro client and an n8n workflow served from Docker.

## What it does

1. A student opens the Astro app.
2. They submit a `deviceId` and `temperature`.
3. They choose the local Docker workflow or a remote n8n Cloud webhook.
4. The browser sends a `POST` request to the selected n8n webhook.
5. n8n evaluates the temperature.
6. If the reading is `warning` or `critical`, n8n sends an alert email.
7. The browser renders the JSON response.

Example response:

```json
{
  "deviceId": "sensor-1",
  "temperature": 42,
  "severity": "warning",
  "message": "Temperature is above normal. Check the device."
}
```

## Run it

From this folder:

```bash
docker compose up
```

In a second terminal:

```bash
npm install
npm run dev
```

Open the Astro client:

```text
http://localhost:4321
```

n8n runs here:

```text
http://localhost:5678
```

Local demo emails appear here:

```text
http://localhost:8025
```

The local webhook URL used by the client is:

```text
http://localhost:5678/webhook/temperature-alert
```

The default remote webhook URL is:

```text
https://iaio.app.n8n.cloud/webhook/temperature-alert
```

## Temperature rules

| Temperature | Severity | Message |
| --- | --- | --- |
| Below 35 | `normal` | Temperature is normal. No action needed. |
| 35 to 49.9 | `warning` | Temperature is above normal. Check the device. Sends a local email. |
| 50 or higher | `critical` | Temperature is dangerously high. Stop the device and inspect it now. Sends a local email. |
| Not a number | `error` | Temperature must be a number. |

Local emails are sent to `teacher@example.test` inside Mailpit only. This is intentional for the classroom demo: no real SMTP account is required. Remote emails use whatever email credential is configured in n8n Cloud.

## Configure the client

Copy the example env file if you want to change the local or remote webhook URLs:

```bash
cp .env.example .env
```

Then edit:

```text
PUBLIC_LOCAL_N8N_WEBHOOK_URL=http://localhost:5678/webhook/temperature-alert
PUBLIC_REMOTE_N8N_WEBHOOK_URL=https://iaio.app.n8n.cloud/webhook/temperature-alert
```

You can also paste a remote webhook URL directly in the Astro UI after choosing `Remote n8n Cloud`. The browser saves that remote URL locally.

## Test the webhook with curl

```bash
curl -X POST http://localhost:5678/webhook/temperature-alert \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"sensor-1","temperature":42}'
```

## Reset n8n data

The n8n database is stored in the Docker volume `temperature-alert-demo_n8n_data`.
To start fresh:

```bash
docker compose down -v
docker compose up
```
