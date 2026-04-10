import type { APIRoute } from "astro";
import { getDb } from "../../../db";

export const GET: APIRoute = async () => {
  const db = await getDb();
  const games = await db.getAllGames();
  return new Response(JSON.stringify(games), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const { name } = await request.json();
  if (!name || typeof name !== "string") {
    return new Response(JSON.stringify({ error: "Name is required" }), {
      status: 400,
    });
  }
  const db = await getDb();
  const game = await db.addGame(name);
  return new Response(JSON.stringify(game), { status: 201 });
};
