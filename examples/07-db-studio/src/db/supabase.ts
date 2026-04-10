import { createClient } from "@supabase/supabase-js";
import type { DbClient } from "./types";

const supabaseClient = createClient(
  import.meta.env.SUPABASE_URL || "",
  import.meta.env.SUPABASE_SERVICE_KEY || ""
);

const supabase: DbClient = {
  async getAllGames() {
    const { data, error } = await supabaseClient
      .from("games")
      .select("*")
      .order("votes", { ascending: false });

    if (error) throw error;
    return data.map((g: any) => ({
      id: g.id,
      name: g.name,
      votes: g.votes,
      createdAt: new Date(g.created_at),
    }));
  },

  async addGame(name: string) {
    const { data, error } = await supabaseClient
      .from("games")
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      votes: data.votes,
      createdAt: new Date(data.created_at),
    };
  },

  async voteForGame(id: string) {
    // Use RPC for atomic increment, or fallback to read-then-update
    const { data, error } = await supabaseClient.rpc("increment_votes", {
      game_id: id,
    });

    if (error) {
      // Fallback: read + update (less safe but works without the RPC function)
      const { data: game } = await supabaseClient
        .from("games")
        .select("*")
        .eq("id", id)
        .single();
      if (!game) throw new Error(`Game not found: ${id}`);

      const { data: updated, error: updateErr } = await supabaseClient
        .from("games")
        .update({ votes: game.votes + 1 })
        .eq("id", id)
        .select()
        .single();
      if (updateErr) throw updateErr;
      return {
        id: updated.id,
        name: updated.name,
        votes: updated.votes,
        createdAt: new Date(updated.created_at),
      };
    }

    // RPC returns the updated row
    return {
      id: data.id,
      name: data.name,
      votes: data.votes,
      createdAt: new Date(data.created_at),
    };
  },

  async deleteGame(id: string) {
    const { error } = await supabaseClient
      .from("games")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async seed(seedData) {
    const { error: deleteErr } = await supabaseClient
      .from("games")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all
    if (deleteErr) throw deleteErr;

    const { error: insertErr } = await supabaseClient
      .from("games")
      .insert(seedData.map((g) => ({ name: g.name, votes: g.votes })));
    if (insertErr) throw insertErr;
  },
};

export default supabase;
