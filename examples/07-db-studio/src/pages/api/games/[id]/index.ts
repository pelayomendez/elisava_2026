import type { APIRoute } from "astro";
import { getDb } from "../../../../db";

export const DELETE: APIRoute = async ({ params }) => {
  const db = await getDb();
  await db.deleteGame(params.id!);
  return new Response(null, { status: 204 });
};
