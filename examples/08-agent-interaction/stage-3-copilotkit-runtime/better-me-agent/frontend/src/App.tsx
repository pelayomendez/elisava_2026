import { useEffect, useState } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import { useAgent } from "@copilotkit/react-core/v2";
import ChallengeCard from "./components/ChallengeCard";
import ProgressPanel from "./components/ProgressPanel";

type ActivityItem = {
  id: string;
  label: string;
  tone: "idle" | "live" | "done";
};

function formatStepName(stepName: string) {
  return stepName
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export default function App() {
  const [dailyChallenge, setDailyChallenge] = useState(
    "Ask the agent for today's habit challenge."
  );
  const [motivationMessage, setMotivationMessage] = useState(
    "Consistency beats intensity."
  );
  const [accepted, setAccepted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    {
      id: "idle",
      label: "Waiting for the next coaching message.",
      tone: "idle",
    },
  ]);
  const { agent } = useAgent({ agentId: "default" });

  useEffect(() => {
    const pushActivity = (label: string, tone: ActivityItem["tone"] = "live") => {
      setActivityFeed((current) => {
        const next = [
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            label,
            tone,
          },
          ...current,
        ];

        return next.slice(0, 8);
      });
    };

    const subscription = agent.subscribe({
      onRunInitialized: () => {
        setActivityFeed([
          {
            id: `${Date.now()}-run`,
            label: "Run started.",
            tone: "live",
          },
        ]);
      },
      onStepStartedEvent: ({ event }) => {
        pushActivity(`Step started: ${formatStepName(event.stepName)}`);
      },
      onStepFinishedEvent: ({ event }) => {
        pushActivity(`Step finished: ${formatStepName(event.stepName)}`, "done");
      },
      onCustomEvent: ({ event }) => {
        const statusLabel =
          event.name === "coach_status" &&
          typeof event.value === "object" &&
          event.value !== null &&
          "label" in event.value &&
          typeof event.value.label === "string"
            ? event.value.label
            : `Custom event: ${event.name}`;

        pushActivity(statusLabel);
      },
      onRawEvent: ({ event }) => {
        const rawEvent = event as {
          type?: string;
          title?: string;
          delta?: string;
        };

        if (rawEvent.type === "THINKING_START") {
          pushActivity(rawEvent.title || "Thinking through the next best challenge.");
        }

        if (rawEvent.type === "THINKING_END") {
          pushActivity("Thinking complete.", "done");
        }
      },
      onTextMessageStartEvent: () => {
        pushActivity("Writing the final reply.");
      },
      onTextMessageEndEvent: () => {
        pushActivity("Reply ready.", "done");
      },
      onRunFinalized: () => {
        pushActivity("Run finished.", "done");
      },
      onRunFailed: () => {
        pushActivity("Run failed.", "done");
      },
      onRunErrorEvent: () => {
        pushActivity("Runtime error received.", "done");
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [agent]);

  useCopilotAction({
    name: "setDailyChallenge",
    description: "Set the user's daily challenge in the UI",
    parameters: [
      {
        name: "challenge",
        type: "string",
        description: "The daily challenge text",
        required: true,
      },
    ],
    handler: async ({ challenge }: { challenge: string }) => {
      setDailyChallenge(challenge);
      setAccepted(false);
      setCompleted(false);
    },
  });

  useCopilotAction({
    name: "updateMotivationMessage",
    description: "Update the motivational message in the UI",
    parameters: [
      {
        name: "message",
        type: "string",
        description: "The short motivational message",
        required: true,
      },
    ],
    handler: async ({ message }: { message: string }) => {
      setMotivationMessage(message);
    },
  });

  useCopilotAction({
    name: "markChallengeAccepted",
    description: "Mark the challenge as accepted",
    parameters: [],
    handler: async () => {
      setAccepted(true);
    },
  });

  useCopilotAction({
    name: "markChallengeCompleted",
    description: "Mark the challenge as completed",
    parameters: [],
    handler: async () => {
      setCompleted(true);
    },
  });

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Stage 3</p>
        <h1>Better Me Agent with a real CopilotKit runtime connection.</h1>
        <p className="hero-copy">
          This version connects CopilotKit to a live AG-UI FastAPI endpoint
          instead of using a placeholder runtime URL.
        </p>
      </section>

      <section className="workspace-grid">
        <div className="left-column">
          <ChallengeCard
            challenge={dailyChallenge}
            motivationMessage={motivationMessage}
          />
          <ProgressPanel
            accepted={accepted}
            completed={completed}
            onAccept={() => setAccepted(true)}
            onComplete={() => setCompleted(true)}
          />
          <section className="card note-card">
            <p className="section-label">How To Test</p>
            <p>
              Open the Copilot sidebar and say: "I forgot to drink water
              yesterday."
            </p>
          </section>
        </div>

        <div className="right-column">
          <div className="card info-card">
            <p className="section-label">Connection</p>
            <h2>CopilotKit runtime</h2>
            <p>
              Frontend runtime URL:
              <br />
              <code>http://localhost:8001/copilotkit</code>
            </p>
            <p>
              Backend health check:
              <br />
              <code>http://localhost:8001/health</code>
            </p>
          </div>

          <section className="card activity-card">
            <p className="section-label">Live Agent Activity</p>
            <h2>Why streaming matters</h2>
            <div className="activity-list">
              {activityFeed.map((item) => (
                <div key={item.id} className={`activity-item activity-${item.tone}`}>
                  <span className="activity-dot" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <CopilotSidebar
        instructions={
          "You are Better Me Agent, a supportive habit coach. Keep answers short, positive, and personalized."
        }
        labels={{
          title: "Better Me Agent",
          initial: "How did your habits go today?",
        }}
        defaultOpen
      />
    </main>
  );
}
