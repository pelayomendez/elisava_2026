import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { seedGames } from "../src/seed/games";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

/*
  Run this SQL in the Supabase SQL Editor to create the table:

  CREATE TABLE games (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name       TEXT NOT NULL,
    votes      INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Optional: atomic vote increment function
  CREATE OR REPLACE FUNCTION increment_votes(game_id UUID)
  RETURNS games AS $$
    UPDATE games SET votes = votes + 1 WHERE id = game_id RETURNING *;
  $$ LANGUAGE sql;

  -- Enable realtime
  ALTER PUBLICATION supabase_realtime ADD TABLE games;
*/

async function main() {
  console.log("Seeding Supabase...");

  const { error: deleteErr } = await supabase
    .from("games")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteErr) throw deleteErr;

  const { error: insertErr } = await supabase
    .from("games")
    .insert(seedGames.map((g) => ({ name: g.name, votes: g.votes })));
  if (insertErr) throw insertErr;

  const { count } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true });

  console.log(`Seeded ${count} games.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
