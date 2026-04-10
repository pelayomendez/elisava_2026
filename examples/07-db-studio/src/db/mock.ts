import type { DbClient, Game } from "./types";
import { seedGames } from "../seed/games";

// In-memory store — resets when the server restarts
let games: Game[] = [];

// Auto-seed on first load
seedFromData(seedGames);

function seedFromData(data: Array<{ name: string; votes: number }>) {
  games = data.map((g) => ({
    id: crypto.randomUUID(),
    name: g.name,
    votes: g.votes,
    createdAt: new Date(),
  }));
}

const mock: DbClient = {
  async getAllGames() {
    return [...games].sort((a, b) => b.votes - a.votes);
  },

  async addGame(name: string) {
    const game: Game = {
      id: crypto.randomUUID(),
      name,
      votes: 0,
      createdAt: new Date(),
    };
    games.push(game);
    return game;
  },

  async voteForGame(id: string) {
    const game = games.find((g) => g.id === id);
    if (!game) throw new Error(`Game not found: ${id}`);
    game.votes += 1;
    return game;
  },

  async deleteGame(id: string) {
    const index = games.findIndex((g) => g.id === id);
    if (index === -1) throw new Error(`Game not found: ${id}`);
    games.splice(index, 1);
  },

  async seed(data) {
    seedFromData(data);
  },
};

export default mock;
