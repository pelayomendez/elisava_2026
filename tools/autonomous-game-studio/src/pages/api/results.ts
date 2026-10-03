import type { APIContext } from 'astro';
import db from '../../lib/db';

export function GET(_context: APIContext) {
  const rows = db.prepare('SELECT game, count AS votes FROM votes ORDER BY count DESC').all();

  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}
