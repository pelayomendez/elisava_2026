import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedGames } from "../src/seed/games";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  await prisma.game.deleteMany();
  await prisma.game.createMany({
    data: seedGames.map((g) => ({ name: g.name, votes: g.votes })),
  });
  const count = await prisma.game.count();
  console.log(`Seeded ${count} games.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
