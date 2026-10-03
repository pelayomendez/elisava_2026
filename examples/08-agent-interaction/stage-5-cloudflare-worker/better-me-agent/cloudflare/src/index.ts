import { agentContract, promptTemplate } from "./contract";

export interface Env {
  DB: D1Database;
  MISTRAL_API_KEY?: string;
  MISTRAL_MODEL?: string;
  BETTER_ME_SLACK_SUBJECT?: string;
  BETTER_ME_BACKGROUND_MESSAGE?: string;
  SLACK_WEBHOOK_URL?: string;
}

type RunMode = "manual-run" | "manual-notify" | "scheduled";

type RunResult = {
  answer: string;
  mode: RunMode;
  model: string;
  slackSent: boolean;
  slackDetail: string;
};

const DEFAULT_MODEL = "mistral-medium-latest";
const DEFAULT_SUBJECT = "Better Me Agent Reminder";
const DEFAULT_BACKGROUND_MESSAGE =
  "Create today's proactive habit reminder for the user.";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/health") {
        return json({
          status: "ok",
          mode: "cloudflare-worker",
          storage: "d1",
        });
      }

      if (request.method === "GET" && url.pathname === "/agent/memory") {
        await ensureSeedMemory(env);
        const memory = await readMemory(env);
        return json({ memory });
      }

      if (request.method === "GET" && url.pathname === "/agent/runs") {
        const limitParam = url.searchParams.get("limit");
        const limit = clampLimit(Number(limitParam ?? "10"));
        const runs = await env.DB.prepare(
          `SELECT id, created_at, trigger_mode, message, answer, model, slack_sent, slack_detail
           FROM run_logs
           ORDER BY id DESC
           LIMIT ?1`
        )
          .bind(limit)
          .all();

        return json({ runs: runs.results ?? [] });
      }

      if (request.method === "POST" && url.pathname === "/agent/run") {
        const payload = await parseMessagePayload(request);
        const result = await runAgent(env, payload.message, "manual-run", false);
        return json({ answer: result.answer, model: result.model });
      }

      if (request.method === "POST" && url.pathname === "/agent/notify") {
        const payload = await parseMessagePayload(request);
        const result = await runAgent(env, payload.message, "manual-notify", true);
        return json({
          answer: result.answer,
          model: result.model,
          slack_sent: result.slackSent,
          slack_detail: result.slackDetail,
        });
      }

      return json({ error: "Not found" }, 404);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }

      return json(
        {
          error: error instanceof Error ? error.message : "Unexpected Worker error.",
        },
        500
      );
    }
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    const message = env.BETTER_ME_BACKGROUND_MESSAGE || DEFAULT_BACKGROUND_MESSAGE;
    ctx.waitUntil(runAgent(env, message, "scheduled", true));
  },
};

async function runAgent(
  env: Env,
  message: string,
  mode: RunMode,
  notifySlack: boolean
): Promise<RunResult> {
  await ensureSeedMemory(env);

  const memory = await readMemory(env);
  const prompt = buildPrompt(message, memory);
  const model = env.MISTRAL_MODEL || DEFAULT_MODEL;
  const answer = await callModel(env, prompt, message, model);

  let slackSent = false;
  let slackDetail = "Slack not requested.";

  if (notifySlack) {
    const notification = await sendSlack(
      env,
      env.BETTER_ME_SLACK_SUBJECT || DEFAULT_SUBJECT,
      answer
    );
    slackSent = notification.sent;
    slackDetail = notification.detail;
  }

  await recordRun(env, {
    createdAt: new Date().toISOString(),
    mode,
    message,
    answer,
    model: env.MISTRAL_API_KEY ? model : "fallback-local-template",
    slackSent,
    slackDetail,
  });

  await rememberLatestRun(env, message, answer, mode);

  return {
    answer,
    mode,
    model: env.MISTRAL_API_KEY ? model : "fallback-local-template",
    slackSent,
    slackDetail,
  };
}

function buildPrompt(message: string, memory: string[]): string {
  return promptTemplate
    .replace("{agents}", agentContract.agents)
    .replace("{task}", agentContract.task)
    .replace("{memory}", memory.map((item) => `- ${item}`).join("\n"))
    .replace("{tools}", agentContract.tools)
    .replace("{evals}", agentContract.evals)
    .replace("{message}", message);
}

async function callModel(
  env: Env,
  prompt: string,
  message: string,
  model: string
): Promise<string> {
  if (!env.MISTRAL_API_KEY) {
    return fallbackAnswer(message);
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackAnswer(message);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || fallbackAnswer(message);
  } catch {
    return fallbackAnswer(message);
  }
}

function fallbackAnswer(message: string): string {
  const lowered = message.toLowerCase();

  if (lowered.includes("water") || lowered.includes("drink")) {
    return (
      "Today's challenge: drink one full glass of water now and another before dinner. " +
      "Small steps beat perfect plans. What part of your afternoon makes that easiest?"
    );
  }

  if (lowered.includes("sleep")) {
    return (
      "Tonight's challenge: do a 10-minute wind-down without your phone before bed. " +
      "Consistency matters more than intensity. What time feels realistic for that?"
    );
  }

  if (
    lowered.includes("proactive") ||
    lowered.includes("today") ||
    lowered.includes("reminder")
  ) {
    return (
      "Today's challenge: take a 10-minute walk and drink one glass of water right after it. " +
      "You're building momentum, not trying to be perfect. Want a variation next time?"
    );
  }

  return (
    "Today's challenge: take a 10-minute stretch or walk break. " +
    "Tiny habits still count. What part of the day feels easiest for that?"
  );
}

async function ensureSeedMemory(env: Env): Promise<void> {
  const seeds: Array<[string, string]> = [
    ["goal_sleep", agentContract.starterMemory[0]],
    ["habit_water", agentContract.starterMemory[1]],
    ["recent_win", agentContract.starterMemory[2]],
    ["tone", agentContract.starterMemory[3]],
  ];

  for (const [key, value] of seeds) {
    await insertMemoryIfMissing(env, key, value);
  }
}

async function readMemory(env: Env): Promise<string[]> {
  const result = await env.DB.prepare(
    `SELECT memory_value
     FROM user_memory
     ORDER BY memory_key ASC`
  ).all<{ memory_value: string }>();

  return (result.results ?? []).map((row) => row.memory_value);
}

async function rememberLatestRun(
  env: Env,
  message: string,
  answer: string,
  mode: RunMode
): Promise<void> {
  await upsertMemory(env, "last_user_message", `Last user message: ${message}`);
  await upsertMemory(env, "last_agent_answer", `Last agent answer: ${answer}`);
  await upsertMemory(env, "last_run_mode", `Last run mode: ${mode}`);
  await upsertMemory(env, "last_run_at", `Last run time: ${new Date().toISOString()}`);
}

async function upsertMemory(env: Env, key: string, value: string): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO user_memory (memory_key, memory_value, updated_at)
     VALUES (?1, ?2, ?3)
     ON CONFLICT(memory_key) DO UPDATE SET
       memory_value = excluded.memory_value,
       updated_at = excluded.updated_at`
  )
    .bind(key, value, new Date().toISOString())
    .run();
}

async function insertMemoryIfMissing(
  env: Env,
  key: string,
  value: string
): Promise<void> {
  await env.DB.prepare(
    `INSERT OR IGNORE INTO user_memory (memory_key, memory_value, updated_at)
     VALUES (?1, ?2, ?3)`
  )
    .bind(key, value, new Date().toISOString())
    .run();
}

async function recordRun(
  env: Env,
  run: {
    createdAt: string;
    mode: RunMode;
    message: string;
    answer: string;
    model: string;
    slackSent: boolean;
    slackDetail: string;
  }
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO run_logs (
      created_at,
      trigger_mode,
      message,
      answer,
      model,
      slack_sent,
      slack_detail
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
  )
    .bind(
      run.createdAt,
      run.mode,
      run.message,
      run.answer,
      run.model,
      run.slackSent ? 1 : 0,
      run.slackDetail
    )
    .run();
}

async function sendSlack(
  env: Env,
  subject: string,
  message: string
): Promise<{ sent: boolean; detail: string }> {
  if (!env.SLACK_WEBHOOK_URL) {
    return {
      sent: false,
      detail: "Missing Slack configuration: SLACK_WEBHOOK_URL",
    };
  }

  try {
    const response = await fetch(env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `*${subject}*\n${message}`,
      }),
    });

    if (!response.ok) {
      return {
        sent: false,
        detail: `Slack returned status ${response.status}.`,
      };
    }

    return {
      sent: true,
      detail: "Slack message sent successfully.",
    };
  } catch (error) {
    return {
      sent: false,
      detail: error instanceof Error ? error.message : "Unknown Slack error.",
    };
  }
}

async function parseMessagePayload(request: Request): Promise<{ message: string }> {
  const payload = (await request.json()) as { message?: unknown };

  if (typeof payload.message !== "string" || !payload.message.trim()) {
    throw new Response(
      JSON.stringify({ error: "Body must include a non-empty 'message' string." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return { message: payload.message.trim() };
}

function clampLimit(value: number): number {
  if (!Number.isFinite(value)) {
    return 10;
  }

  return Math.max(1, Math.min(Math.floor(value), 50));
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
