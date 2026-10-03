import type { APIContext } from "astro";
import { Mistral } from "@mistralai/mistralai";

const SYSTEM_PROMPT = `You are a text adventure game writer. Generate a short, atmospheric text adventure game script in valid JSON.

The JSON must follow this exact schema:
{
  "title": "string",
  "start": "room_key",
  "rooms": {
    "room_key": {
      "text": "Scene description shown to the player.",
      "choices": [
        { "label": "Choice text visible to player", "next": "another_room_key" }
      ]
    }
  }
}

Rules:
- Create exactly 5-7 rooms
- Each room must have 1-3 choices
- The last room(s) must have a choice with "next": "end"
- Room keys must be snake_case strings
- Write vivid, atmospheric descriptions (2-3 sentences each)
- Match the tone and setting of the game brief provided
- Return ONLY the JSON object, no markdown, no explanation`;

export async function POST({ request }: APIContext) {
  const apiKey = import.meta.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MISTRAL_API_KEY is not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { slug: string; brief: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { slug, brief } = body;
  if (!slug || !brief) {
    return new Response(JSON.stringify({ error: "Missing slug or brief" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = new Mistral({ apiKey });

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Create a 5-room text adventure for: ${brief}` },
      ],
      temperature: 0.8,
      responseFormat: { type: "json_object" },
    });

    const raw = response.choices?.[0]?.message?.content ?? "";
    const text = typeof raw === "string"
      ? raw
      : raw
          .map((c: any) => (typeof c === "object" && "text" in c ? c.text : ""))
          .join("");

    const story = JSON.parse(text);

    return new Response(JSON.stringify(story), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[generate-game]", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate game", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
