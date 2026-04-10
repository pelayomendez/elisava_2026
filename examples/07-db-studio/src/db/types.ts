export interface Game {
  id: string;
  name: string;
  votes: number;
  createdAt: Date;
}

export interface DbClient {
  getAllGames(): Promise<Game[]>;
  addGame(name: string): Promise<Game>;
  voteForGame(id: string): Promise<Game>;
  deleteGame(id: string): Promise<void>;
  seed(games: Array<{ name: string; votes: number }>): Promise<void>;
}
