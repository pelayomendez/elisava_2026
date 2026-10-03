import Database from 'better-sqlite3';
import path from 'node:path';

const dbPath = path.join(process.cwd(), 'votes.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS votes (
    game TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
  )
`);

export default db;
