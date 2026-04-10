import type { DbClient } from "./types";

let client: DbClient;

export async function getDb(): Promise<DbClient> {
  if (client) return client;

  const backend = import.meta.env.DB_BACKEND || "mock";

  switch (backend) {
    case "prisma":
      client = (await import("./prisma")).default;
      break;
    case "mongoose":
      client = (await import("./mongoose")).default;
      break;
    case "supabase":
      client = (await import("./supabase")).default;
      break;
    default:
      client = (await import("./mock")).default;
  }

  return client;
}
