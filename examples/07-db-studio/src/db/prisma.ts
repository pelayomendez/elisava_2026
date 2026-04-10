import { PrismaClient } from "../generated/prisma/client";
import type { DbClient } from "./types";

const prismaClient = new PrismaClient();

const prisma: DbClient = {
  async getAllGames() {
    const games = await prismaClient.game.findMany({
      orderBy: { votes: "desc" },
    });
    return games.map((g) => ({
      id: g.id,
      name: g.name,
      votes: g.votes,
      createdAt: g.createdAt,
    }));
  },

  async addGame(name: string) {
    const game = await prismaClient.game.create({ data: { name } });
    return {
      id: game.id,
      name: game.name,
      votes: game.votes,
      createdAt: game.createdAt,
    };
  },

  async voteForGame(id: string) {
    const game = await prismaClient.game.update({
      where: { id },
      data: { votes: { increment: 1 } },
    });
    return {
      id: game.id,
      name: game.name,
      votes: game.votes,
      createdAt: game.createdAt,
    };
  },

  async deleteGame(id: string) {
    await prismaClient.game.delete({ where: { id } });
  },

  async seed(data) {
    await prismaClient.game.deleteMany();
    await prismaClient.game.createMany({
      data: data.map((g) => ({ name: g.name, votes: g.votes })),
    });
  },
};

export default prisma;
