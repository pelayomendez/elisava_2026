import type { APIContext } from 'astro';
import db from '../../lib/db';

export async function POST({ request }: APIContext) {
  let body: { game: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { game } = body;
  if (!game || typeof game !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing game field' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  db.prepare(
    'INSERT INTO votes (game, count) VALUES (?, 1) ON CONFLICT(game) DO UPDATE SET count = count + 1'
  ).run(game);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
