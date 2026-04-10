import "dotenv/config";
import mongoose from "mongoose";
import { seedGames } from "../src/seed/games";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/games_voting";

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const GameModel = mongoose.model("Game", gameSchema);

async function main() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await GameModel.deleteMany({});
  await GameModel.insertMany(
    seedGames.map((g) => ({ name: g.name, votes: g.votes }))
  );

  const count = await GameModel.countDocuments();
  console.log(`Seeded ${count} games.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
