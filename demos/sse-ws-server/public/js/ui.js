// ═══════════════════════════════════════════════════════════════════════════════
// UI Helpers
// ═══════════════════════════════════════════════════════════════════════════════
//
// Shared DOM utility functions used by both the SSE and Webhook modules.
// These handle the event log panels and tab switching — nothing protocol-related.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Prepend a new entry to one of the event log panels.
 *
 * @param {string} logId    - DOM id of the log container ('sse-log', 'webhook-log', 'received-log')
 * @param {string} title    - Bold heading line (e.g. "🔔 New order")
 * @param {string} detail   - Secondary detail text
 * @param {string} className - CSS classes for styling (e.g. 'event-entry success-event')
 */
function addToLog(logId, title, detail, className) {
  const log = document.getElementById(logId);

  // Remove the "empty state" placeholder on first entry
  const empty = log.querySelector(".empty-state");
  if (empty) empty.remove();

  const entry = document.createElement("div");
  entry.className = className;
  entry.innerHTML = `
    <div class="event-time">${new Date().toLocaleTimeString()}</div>
    <div class="event-type">${title}</div>
    <div class="event-data">${detail}</div>
  `;

  // Newest events at the top
  log.prepend(entry);

  // Cap at 30 entries to prevent memory bloat in long-running demos
  while (log.children.length > 30) log.lastChild.remove();
}

/**
 * Clear all entries from a log panel.
 */
function clearLog(logId) {
  document.getElementById(logId).innerHTML =
    '<div class="empty-state">Cleared</div>';
}

/**
 * Simple tab switcher for the webhook delivery/received panels.
 */
function switchTab(btn, tabId) {
  // Deactivate all tabs in the same group
  btn.parentElement
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");

  // Hide all tab panels, show the selected one
  document.getElementById("delivery-tab").classList.add("hidden");
  document.getElementById("received-tab").classList.add("hidden");
  document.getElementById(tabId).classList.remove("hidden");
}

function ensureHttpOrigin() {
  if (window.location.protocol !== "file:") {
    return true;
  }

  const suggestedUrl = "http://localhost:3001/";

  document.body.innerHTML = `
    <main style="font-family: var(--font, monospace); max-width: 760px; margin: 3rem auto; padding: 1.5rem; border: 1px solid #2a2a3a; border-radius: 10px; background: #12121a; color: #e4e4ef;">
      <h1 style="margin-bottom: 0.75rem; font-size: 1.2rem;">⚠️ Open this demo over HTTP, not as a local file</h1>
      <p style="line-height: 1.6; color: #b9b9c7;">
        Your browser blocks <code>file://</code> pages from loading network resources like SSE streams and API calls.
      </p>
      <p style="line-height: 1.6; color: #b9b9c7; margin-top: 0.5rem;">
        Start the server and open:
      </p>
      <pre style="margin-top: 0.5rem; padding: 0.7rem; background: #0a0a0f; border: 1px solid #2a2a3a; border-radius: 6px; overflow:auto;">${suggestedUrl}</pre>
      <p style="margin-top: 1rem; color: #8888a0; font-size: 0.85rem;">Attempting redirect in 1 second...</p>
    </main>
  `;

  setTimeout(() => {
    window.location.href = suggestedUrl;
  }, 1000);

  return false;
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
// Start the SSE connection and load existing webhook subscriptions on page load.

if (ensureHttpOrigin()) {
  connectSSE();
  refreshWebhooks();
}
