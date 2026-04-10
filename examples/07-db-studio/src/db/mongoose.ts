import mongoose, { Schema, model, type HydratedDocument } from "mongoose";
import type { DbClient, Game } from "./types";

// Schema & Model
const gameSchema = new Schema({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const GameModel =
  mongoose.models.Game || model("Game", gameSchema);

// Connection helper
let connected = false;
async function connect() {
  if (connected) return;
  const uri = import.meta.env.MONGODB_URI || "mongodb://localhost:27017/games_voting";
  await mongoose.connect(uri);
  connected = true;
}

// Map Mongoose document → our Game type
function toGame(doc: HydratedDocument<any>): Game {
  return {
    id: doc._id.toString(),
    name: doc.name,
    votes: doc.votes,
    createdAt: doc.createdAt,
  };
}

const mongooseClient: DbClient = {
  async getAllGames() {
    await connect();
    const docs = await GameModel.find().sort({ votes: -1 });
    return docs.map(toGame);
  },

  async addGame(name: string) {
    await connect();
    const doc = await GameModel.create({ name });
    return toGame(doc);
  },

  async voteForGame(id: string) {
    await connect();
    const doc = await GameModel.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    if (!doc) throw new Error(`Game not found: ${id}`);
    return toGame(doc);
  },

  async deleteGame(id: string) {
    await connect();
    await GameModel.findByIdAndDelete(id);
  },

  async seed(data) {
    await connect();
    await GameModel.deleteMany({});
    await GameModel.insertMany(
      data.map((g) => ({ name: g.name, votes: g.votes }))
    );
  },
};

export default mongooseClient;
