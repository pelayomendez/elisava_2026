// ═══════════════════════════════════════════════════════════════════════════════
// SSE (Server-Sent Events) — Client Side
// ═══════════════════════════════════════════════════════════════════════════════
//
// SSE is a browser-native API for receiving a ONE-WAY stream from the server.
// The browser opens a long-lived HTTP GET request, and the server keeps the
// connection open, pushing text events down the wire whenever it wants.
//
// Key characteristics:
//   - One direction only: server → client (the client cannot send data back
//     over the same connection — it uses regular fetch() for that)
//   - Built on plain HTTP — works through proxies, CDNs, firewalls
//   - Auto-reconnects if the connection drops (with Last-Event-ID header)
//   - Text-based (no binary)
//   - Native browser API: EventSource — no libraries needed
//
// The SSE wire format looks like this:
//
//   id: abc123
//   event: stock-update
//   data: {"symbol":"AAPL","price":"182.50"}
//
//   id: abc124
//   event: notification
//   data: {"title":"Hello","body":"World"}
//
// Each message is separated by a blank line (\n\n).
// ═══════════════════════════════════════════════════════════════════════════════

/** Reference to the EventSource instance */
let eventSource = null;

/** Total count of events received in this session */
let eventCount = 0;

/** In-memory map of latest stock prices, keyed by symbol */
const stocks = {};

/**
 * Opens an SSE connection to the server and registers event listeners.
 *
 * Under the hood, `new EventSource('/sse')` sends:
 *   GET /sse HTTP/1.1
 *   Accept: text/event-stream
 *
 * The server responds with:
 *   HTTP/1.1 200 OK
 *   Content-Type: text/event-stream
 *   Cache-Control: no-cache
 *   Connection: keep-alive
 *
 * ...and then keeps the connection open, writing events as they happen.
 */
function connectSSE() {
  // EventSource is a built-in browser API — no npm install needed.
  // It automatically reconnects if the connection drops.
  eventSource = new EventSource("/sse");

  // ─── Listen for named events ───────────────────────────────────────────────
  // The server sends `event: <name>`, so we listen with addEventListener(<name>).
  // This is different from the generic `onmessage` which only fires for events
  // WITHOUT a named event field.

  // "connected" — fired once when the SSE connection is established
  eventSource.addEventListener("connected", (e) => {
    const data = JSON.parse(e.data);
    document.getElementById("sse-dot").className = "status-dot connected";
    document.getElementById("sse-status").textContent = "Connected";
    document.getElementById("client-count").textContent = data.clientCount;
  });

  // "clients" — fired whenever someone connects/disconnects, so all tabs
  // see the updated count. This is a broadcast pattern — the server pushes
  // the same event to every connected client.
  eventSource.addEventListener("clients", (e) => {
    const data = JSON.parse(e.data);
    document.getElementById("client-count").textContent = data.count;
  });

  // "notification" — a custom push notification from the server.
  // In a real app this could be: new message, order status, deploy finished, etc.
  eventSource.addEventListener("notification", (e) => {
    eventCount++;
    document.getElementById("event-count").textContent = eventCount;
    const data = JSON.parse(e.data);
    addToLog("sse-log", `🔔 ${data.title}`, data.body, "event-entry");
  });

  // "stock-update" — simulated stock price push.
  // This demonstrates SSE's sweet spot: server pushes data at its own pace,
  // the client just listens. No polling, no wasted requests.
  eventSource.addEventListener("stock-update", (e) => {
    eventCount++;
    document.getElementById("event-count").textContent = eventCount;
    const data = JSON.parse(e.data);
    updateStock(data);
  });

  // "ticker-status" — tells the UI whether the auto-ticker is running
  eventSource.addEventListener("ticker-status", (e) => {
    const data = JSON.parse(e.data);
    const btn = document.getElementById("ticker-btn");
    btn.textContent = data.running ? "⏸ Stop Auto" : "▶ Start Auto";
    btn.className = data.running ? "danger" : "primary";
  });

  // Webhook-related events also arrive over SSE — because webhooks are
  // server-to-server, we use SSE to relay delivery status back to the browser.
  eventSource.addEventListener("webhook-registered", () => {
    refreshWebhooks();
  });

  eventSource.addEventListener("webhook-deleted", () => {
    refreshWebhooks();
  });

  eventSource.addEventListener("webhook-delivered", (e) => {
    eventCount++;
    document.getElementById("event-count").textContent = eventCount;
    const data = JSON.parse(e.data);
    const status = data.success ? "success-event" : "error-event";
    addToLog(
      "webhook-log",
      `${data.success ? "✅" : "❌"} ${data.event} → ${data.url}`,
      `Status: ${data.status} | Payload: ${JSON.stringify(data.payload.data)}`,
      `event-entry webhook-event ${status}`
    );
  });

  eventSource.addEventListener("webhook-failed", (e) => {
    eventCount++;
    document.getElementById("event-count").textContent = eventCount;
    const data = JSON.parse(e.data);
    addToLog(
      "webhook-log",
      `❌ FAILED: ${data.event} → ${data.url}`,
      `Error: ${data.error}`,
      "event-entry webhook-event error-event"
    );
  });

  eventSource.addEventListener("webhook-received", (e) => {
    const data = JSON.parse(e.data);
    addToLog(
      "received-log",
      `📬 Received: ${data.headers["x-webhook-event"] || "unknown"}`,
      JSON.stringify(data.body, null, 2),
      "event-entry success-event"
    );
  });

  // ─── Error handling ────────────────────────────────────────────────────────
  // When the connection drops, EventSource automatically tries to reconnect.
  // We just update the UI to show the reconnecting state.
  // If the server sent a `Last-Event-ID`, the browser includes it in the
  // reconnect request so the server can resume from where it left off.
  eventSource.onerror = () => {
    document.getElementById("sse-dot").className = "status-dot disconnected";
    document.getElementById("sse-status").textContent = "Reconnecting...";
  };
}

// ─── Stock ticker rendering ──────────────────────────────────────────────────

/**
 * Update our in-memory stock map and re-render the grid.
 * Each SSE "stock-update" event calls this.
 */
function updateStock(data) {
  stocks[data.symbol] = data;
  renderStocks();
}

/**
 * Renders stock cards into the grid. The flash animation (green/red glow)
 * gives visual feedback that new data just arrived — important for demos!
 */
function renderStocks() {
  const grid = document.getElementById("stock-grid");
  grid.innerHTML = Object.values(stocks)
    .map((s) => {
      const dir = s.change >= 0 ? "up" : "down";
      return `<div class="stock-card flash-${dir}" id="stock-${s.symbol}">
      <div class="symbol">${s.symbol}</div>
      <div class="price">$${s.price}</div>
      <div class="change ${dir}">${s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}%</div>
    </div>`;
    })
    .join("");

  // Remove the flash highlight after 600ms so it can flash again on next update
  setTimeout(() => {
    grid.querySelectorAll(".stock-card").forEach((c) => {
      c.classList.remove("flash-up", "flash-down");
    });
  }, 600);
}

// ─── SSE-related API calls ───────────────────────────────────────────────────
// These are regular HTTP POST requests (not SSE). The client asks the server
// to do something, and the server broadcasts the result to all SSE clients.
// This is the typical pattern: SSE for receiving, fetch() for sending.

/** Ask the server to push one random stock update to all SSE clients */
async function simulateStock() {
  await fetch("/api/simulate-stock", { method: "POST" });
}

/** Toggle the auto-ticker on/off (server sends stock updates every 1.5s) */
async function toggleTicker() {
  await fetch("/api/toggle-ticker", { method: "POST" });
}

/** Send a custom notification that all connected SSE clients will receive */
async function sendNotification() {
  const title = document.getElementById("notif-title").value;
  const body = document.getElementById("notif-body").value;
  await fetch("/api/send-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  // Clear inputs after sending
  document.getElementById("notif-title").value = "";
  document.getElementById("notif-body").value = "";
}
