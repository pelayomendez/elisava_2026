import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// ─── State ───────────────────────────────────────────────────────────────────

/** @type {Set<import("express").Response>} */
const sseClients = new Set();

/** @type {Array<{id: string, type: string, data: any, timestamp: string}>} */
const eventLog = [];

// ─── SSE ─────────────────────────────────────────────────────────────────────

app.get("/sse", (req, res) => {
  // Required headers for SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Send a welcome event
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  res.write(`id: ${id}\n`);
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ message: "SSE connection established", clientCount: sseClients.size + 1 })}\n\n`);

  sseClients.add(res);
  broadcastClientCount();

  console.log(`[SSE] Client connected (${sseClients.size} total)`);

  req.on("close", () => {
    sseClients.delete(res);
    broadcastClientCount();
    console.log(`[SSE] Client disconnected (${sseClients.size} total)`);
  });
});

function broadcastSSE(event, data) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const logEntry = { id, type: event, data, timestamp: new Date().toISOString() };
  eventLog.push(logEntry);
  if (eventLog.length > 100) eventLog.shift();

  for (const client of sseClients) {
    client.write(`id: ${id}\n`);
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

function broadcastClientCount() {
  for (const client of sseClients) {
    client.write(`event: clients\n`);
    client.write(`data: ${JSON.stringify({ count: sseClients.size })}\n\n`);
  }
}

// ─── SSE Demo Endpoints (trigger events from the frontend) ───────────────────

app.post("/api/send-notification", (req, res) => {
  const { title, body } = req.body;
  broadcastSSE("notification", {
    title: title || "New notification",
    body: body || "Something happened!",
  });
  res.json({ ok: true, clients: sseClients.size });
});

app.post("/api/simulate-stock", (req, res) => {
  const symbols = ["AAPL", "GOOG", "TSLA", "AMZN", "MSFT"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const price = (100 + Math.random() * 200).toFixed(2);
  const change = (Math.random() * 10 - 5).toFixed(2);

  broadcastSSE("stock-update", { symbol, price, change: parseFloat(change) });
  res.json({ ok: true, symbol, price });
});

// Auto stock ticker (toggleable)
let stockInterval = null;

app.post("/api/toggle-ticker", (req, res) => {
  if (stockInterval) {
    clearInterval(stockInterval);
    stockInterval = null;
    broadcastSSE("ticker-status", { running: false });
    res.json({ ok: true, running: false });
  } else {
    stockInterval = setInterval(() => {
      const symbols = ["AAPL", "GOOG", "TSLA", "AMZN", "MSFT", "META", "NFLX"];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const price = (100 + Math.random() * 200).toFixed(2);
      const change = (Math.random() * 10 - 5).toFixed(2);
      broadcastSSE("stock-update", { symbol, price, change: parseFloat(change) });
    }, 1500);
    broadcastSSE("ticker-status", { running: true });
    res.json({ ok: true, running: true });
  }
});

// ─── Webhooks ────────────────────────────────────────────────────────────────

// Registered webhook URLs (in-memory)
/** @type {Map<string, {url: string, secret: string, events: string[]}>} */
const webhookSubscriptions = new Map();

// Register a webhook
app.post("/api/webhooks/register", (req, res) => {
  const { url, events } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  const id = "wh_" + Date.now().toString(36);
  const secret = "whsec_" + Math.random().toString(36).slice(2, 14);

  webhookSubscriptions.set(id, {
    url,
    secret,
    events: events || ["*"],
  });

  broadcastSSE("webhook-registered", { id, url, events: events || ["*"] });
  console.log(`[Webhook] Registered: ${id} → ${url}`);

  res.json({ id, secret, url, events: events || ["*"] });
});

// List webhooks
app.get("/api/webhooks", (req, res) => {
  const list = [];
  for (const [id, sub] of webhookSubscriptions) {
    list.push({ id, url: sub.url, events: sub.events });
  }
  res.json(list);
});

// Delete a webhook
app.delete("/api/webhooks/:id", (req, res) => {
  const deleted = webhookSubscriptions.delete(req.params.id);
  if (deleted) {
    broadcastSSE("webhook-deleted", { id: req.params.id });
  }
  res.json({ ok: deleted });
});

// Simulate an event that fires webhooks
app.post("/api/webhooks/trigger", async (req, res) => {
  const { event, payload } = req.body;
  const eventName = event || "order.completed";
  const eventPayload = payload || {
    orderId: "ord_" + Math.random().toString(36).slice(2, 8),
    amount: parseFloat((Math.random() * 500).toFixed(2)),
    currency: "EUR",
  };

  const results = [];

  for (const [id, sub] of webhookSubscriptions) {
    if (sub.events.includes("*") || sub.events.includes(eventName)) {
      const webhookBody = {
        id: "evt_" + Date.now().toString(36),
        type: eventName,
        created: new Date().toISOString(),
        data: eventPayload,
      };

      try {
        const response = await fetch(sub.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": sub.secret,
            "X-Webhook-Event": eventName,
          },
          signal: AbortSignal.timeout(5000),
        });

        const status = response.status;
        results.push({ id, url: sub.url, status, success: status >= 200 && status < 300 });

        broadcastSSE("webhook-delivered", {
          subscriptionId: id,
          url: sub.url,
          event: eventName,
          status,
          success: status >= 200 && status < 300,
          payload: webhookBody,
        });
      } catch (err) {
        results.push({ id, url: sub.url, status: 0, success: false, error: err.message });

        broadcastSSE("webhook-failed", {
          subscriptionId: id,
          url: sub.url,
          event: eventName,
          error: err.message,
          payload: webhookBody,
        });
      }
    }
  }

  res.json({ event: eventName, payload: eventPayload, deliveries: results });
});

// Built-in webhook receiver (so students can test without external URLs)
const receivedWebhooks = [];

app.post("/api/webhooks/receive", (req, res) => {
  const received = {
    id: "recv_" + Date.now().toString(36),
    headers: {
      "x-webhook-secret": req.headers["x-webhook-secret"],
      "x-webhook-event": req.headers["x-webhook-event"],
    },
    body: req.body,
    receivedAt: new Date().toISOString(),
  };

  receivedWebhooks.push(received);
  if (receivedWebhooks.length > 50) receivedWebhooks.shift();

  broadcastSSE("webhook-received", received);
  console.log(`[Webhook] Received: ${req.headers["x-webhook-event"]}`);

  res.status(200).json({ ok: true });
});

app.get("/api/webhooks/received", (req, res) => {
  res.json(receivedWebhooks);
});

// ─── Event log ───────────────────────────────────────────────────────────────

app.get("/api/events", (req, res) => {
  res.json(eventLog.slice(-50));
});

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  🚀 SSE & Webhooks Demo Server`);
  console.log(`  ────────────────────────────`);
  console.log(`  Local:    http://localhost:${PORT}`);
  console.log(`  SSE:      http://localhost:${PORT}/sse`);
  console.log(`  Webhooks: http://localhost:${PORT}/api/webhooks\n`);
});
