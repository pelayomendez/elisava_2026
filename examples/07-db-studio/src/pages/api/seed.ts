import type { APIRoute } from "astro";
import { getDb } from "../../db";
import { seedGames } from "../../seed/games";

export const POST: APIRoute = async () => {
  const db = await getDb();
  await db.seed(seedGames);
  return new Response(JSON.stringify({ ok: true }));
};
