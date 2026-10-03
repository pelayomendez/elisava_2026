import { useEffect, useState } from "react";

type RunItem = {
  id: number;
  created_at: string;
  trigger_mode: string;
  message: string;
  answer: string;
  model: string;
  slack_sent: number;
  slack_detail: string | null;
};

const baseUrl =
  import.meta.env.VITE_AGENT_BASE_URL?.trim() || "http://localhost:8787";

export default function App() {
  const [memory, setMemory] = useState<string[]>([]);
  const [runs, setRuns] = useState<RunItem[]>([]);
  const [message, setMessage] = useState("I forgot to drink water yesterday.");
  const [latestAnswer, setLatestAnswer] = useState(
    "Ask the agent for today's coaching message."
  );
  const [status, setStatus] = useState("Connecting to the cloud agent...");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setStatus("Refreshing from the cloud agent...");
    const [memoryResponse, runsResponse] = await Promise.all([
      fetch(`${baseUrl}/agent/memory`),
      fetch(`${baseUrl}/agent/runs?limit=6`),
    ]);

    if (!memoryResponse.ok || !runsResponse.ok) {
      throw new Error("Could not load agent data.");
    }

    const memoryData = (await memoryResponse.json()) as { memory: string[] };
    const runsData = (await runsResponse.json()) as { runs: RunItem[] };
    setMemory(memoryData.memory);
    setRuns(runsData.runs);
    setStatus("Connected.");
  }

  useEffect(() => {
    void loadData().catch((error: unknown) => {
      setStatus(error instanceof Error ? error.message : "Unknown loading error.");
    });
  }, []);

  async function submit(path: "/agent/run" | "/agent/notify") {
    setLoading(true);
    setStatus(path === "/agent/notify" ? "Sending reminder..." : "Asking the agent...");

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("The cloud agent returned an error.");
      }

      const data = (await response.json()) as {
        answer: string;
        slack_sent?: boolean;
        slack_detail?: string;
      };

      setLatestAnswer(data.answer);
      setStatus(
        path === "/agent/notify"
          ? data.slack_sent
            ? "Reminder sent through the cloud agent."
            : data.slack_detail || "Reminder request finished."
          : "Answer ready."
      );
      await loadData();
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : "Unknown request error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Stage 6</p>
        <h1>Better Me</h1>
        <p className="subtitle">
          A simple final user app powered by the Cloudflare agent.
        </p>
        <p className="connection">
          Backend:
          <code>{baseUrl}</code>
        </p>
      </section>

      <section className="layout">
        <div className="primary-column">
          <article className="panel">
            <p className="eyebrow">Today</p>
            <h2>Your latest coaching message</h2>
            <p className="answer">{latestAnswer}</p>
          </article>

          <article className="panel">
            <p className="eyebrow">Ask The Agent</p>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
            />
            <div className="actions">
              <button disabled={loading} onClick={() => void submit("/agent/run")}>
                {loading ? "Working..." : "Ask again"}
              </button>
              <button
                className="secondary"
                disabled={loading}
                onClick={() => void submit("/agent/notify")}
              >
                Send reminder
              </button>
            </div>
            <p className="status">{status}</p>
          </article>
        </div>

        <div className="secondary-column">
          <article className="panel">
            <p className="eyebrow">Memory</p>
            <h2>What the agent remembers</h2>
            <div className="chip-list">
              {memory.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="eyebrow">Recent Activity</p>
            <h2>Last runs</h2>
            <div className="run-list">
              {runs.map((run) => (
                <div key={run.id} className="run-item">
                  <div className="run-meta">
                    <strong>{run.trigger_mode}</strong>
                    <span>{new Date(run.created_at).toLocaleString()}</span>
                  </div>
                  <p>{run.answer}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
