import type { APIRoute } from "astro";
import { getDb } from "../../../../db";

export const POST: APIRoute = async ({ params }) => {
  const db = await getDb();
  const game = await db.voteForGame(params.id!);
  return new Response(JSON.stringify(game));
};
