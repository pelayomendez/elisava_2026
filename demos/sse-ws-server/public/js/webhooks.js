// ═══════════════════════════════════════════════════════════════════════════════
// Webhooks — Client Side
// ═══════════════════════════════════════════════════════════════════════════════
//
// Webhooks are NOT a browser API. They're a server-to-server pattern:
//
//   1. You register a URL with a service (e.g. Stripe, GitHub, Slack)
//   2. When an event happens, that service sends an HTTP POST to your URL
//   3. Your server receives the POST and processes it
//
// The flow looks like this:
//
//   ┌──────────┐   POST /your-url    ┌──────────────┐
//   │  Stripe  │ ──────────────────→  │  Your Server │
//   └──────────┘   { event, data }    └──────────────┘
//
// Key characteristics:
//   - Fire and forget — the sender POSTs and moves on
//   - One direction: sender → receiver
//   - The receiver must expose a public URL (this is the tricky part)
//   - Latency: hundreds of ms to seconds (it's just an HTTP request)
//   - Retry logic is common (if your server returns 5xx, the sender retries)
//   - Often signed with a secret (X-Webhook-Secret) so you can verify authenticity
//
// In this demo, everything runs on localhost, so we simulate the full cycle:
//   - Register webhook subscriptions (like configuring Stripe's webhook dashboard)
//   - Trigger events (like a payment being completed)
//   - The server POSTs to registered URLs
//   - A built-in receiver endpoint catches those POSTs for demo purposes
//   - SSE relays delivery status back to the browser (since webhooks are server-side)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Register a webhook subscription.
 *
 * This is like going to Stripe's dashboard and adding a webhook endpoint URL.
 * The server stores the URL and will POST to it whenever matching events fire.
 */
async function registerWebhook() {
  const url = document.getElementById("webhook-url").value;
  const events = document
    .getElementById("webhook-events")
    .value.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!url) return alert("Enter a webhook URL");

  // POST to our server's webhook registration endpoint
  // In real life, this would be Stripe's API, GitHub's API, etc.
  await fetch("/api/webhooks/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, events }),
  });
  // The server broadcasts a "webhook-registered" SSE event,
  // which triggers refreshWebhooks() in sse.js
}

/**
 * Shortcut: register the built-in receiver as the webhook URL.
 *
 * In real life, you'd use something like ngrok to expose localhost,
 * or deploy to a server with a public URL. For this demo, our server
 * has a `/api/webhooks/receive` endpoint that acts as the receiver.
 *
 * This means the same server is both SENDER and RECEIVER — just for demo!
 */
async function registerBuiltinWebhook() {
  const baseUrl = window.location.origin;
  document.getElementById(
    "webhook-url"
  ).value = `${baseUrl}/api/webhooks/receive`;

  await fetch("/api/webhooks/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: `${baseUrl}/api/webhooks/receive`,
      events: ["*"], // Subscribe to all event types
    }),
  });
}

/**
 * Delete a webhook subscription by its ID.
 */
async function deleteWebhook(id) {
  await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
  refreshWebhooks();
}

/**
 * Fetch all registered webhooks from the server and render them.
 */
async function refreshWebhooks() {
  const res = await fetch("/api/webhooks");
  const list = await res.json();
  const container = document.getElementById("webhook-list");

  if (list.length === 0) {
    container.innerHTML =
      '<div class="empty-state">No webhooks registered</div>';
    return;
  }

  container.innerHTML = list
    .map(
      (wh) => `
    <div class="webhook-sub">
      <div>
        <div class="url">${wh.url}</div>
        <div style="color:var(--text-dim);font-size:0.65rem">${wh.events.join(", ")} · ${wh.id}</div>
      </div>
      <button class="danger" onclick="deleteWebhook('${wh.id}')" style="flex-shrink:0">×</button>
    </div>
  `
    )
    .join("");
}

/**
 * Trigger a webhook event.
 *
 * This simulates something happening in your system (e.g. an order is completed).
 * The server will:
 *   1. Look up all webhook subscriptions that match this event type
 *   2. Send an HTTP POST to each registered URL
 *   3. Broadcast delivery results back via SSE
 *
 * This is exactly what Stripe does when a payment succeeds — it POSTs to
 * every webhook URL you've registered for the "payment_intent.succeeded" event.
 */
async function triggerWebhook() {
  const event = document.getElementById("trigger-event").value;

  const res = await fetch("/api/webhooks/trigger", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
  });

  const result = await res.json();

  // If no subscriptions matched, show a warning
  if (result.deliveries.length === 0) {
    addToLog(
      "webhook-log",
      "⚠️ No subscriptions matched",
      `Event: ${event}`,
      "event-entry error-event"
    );
  }
}
