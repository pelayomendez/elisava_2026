# Favorite Games Voting

A classroom demo app that teaches database integration. Same UI, different database backends. Built with [Astro](https://astro.build).

## Architecture

```
DB_BACKEND env var
       |
       v
  ┌─────────────────┐
  │  src/db/index.ts │  ← Factory: picks the right backend
  └────────┬────────┘
           │
     ┌─────┼─────────┬──────────┐
     v     v         v          v
   mock  prisma   mongoose   supabase
  (array) (Postgres) (MongoDB)  (Supabase + Realtime)
```

All backends implement the same `DbClient` interface (5 methods):

```ts
getAllGames()    →  list all games, sorted by votes
addGame(name)   →  create a new game
voteForGame(id) →  increment vote count by 1
deleteGame(id)  →  remove a game
seed(data)      →  reset database with seed data
```

## Quick Start

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Run with mock data (no database needed)
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Switching Backends

Change `DB_BACKEND` in `.env` and restart the dev server:

```env
DB_BACKEND=mock      # In-memory (default, no setup)
DB_BACKEND=prisma    # PostgreSQL via Prisma
DB_BACKEND=mongoose  # MongoDB via Mongoose
DB_BACKEND=supabase  # Supabase (SQL + Realtime)
```

---

## Backend Setup

### Mock (default)

No setup needed. Data lives in memory and resets on server restart.

### PostgreSQL + Prisma

1. Start Postgres:
   ```bash
   docker run --name games-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=games_voting -p 5432:5432 -d postgres:16
   ```

2. Set `DATABASE_URL` in `.env` (already set if using defaults).

3. Run migration + seed:
   ```bash
   npx prisma migrate dev --name init
   npm run seed:prisma
   ```

4. Set `DB_BACKEND=prisma` in `.env` and restart.

### MongoDB + Mongoose

1. Start MongoDB:
   ```bash
   docker run --name games-mongo -p 27017:27017 -d mongo:7
   ```
   Or use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) and set `MONGODB_URI` in `.env`.

2. Seed:
   ```bash
   npm run seed:mongoose
   ```

3. Set `DB_BACKEND=mongoose` in `.env` and restart.

### Supabase (SQL + Realtime)

1. Create a free project at [supabase.com](https://supabase.com).

2. Run this SQL in the SQL Editor:
   ```sql
   CREATE TABLE games (
     id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name       TEXT NOT NULL,
     votes      INTEGER DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Atomic vote increment function
   CREATE OR REPLACE FUNCTION increment_votes(game_id UUID)
   RETURNS games AS $$
     UPDATE games SET votes = votes + 1 WHERE id = game_id RETURNING *;
   $$ LANGUAGE sql;

   -- Enable realtime
   ALTER PUBLICATION supabase_realtime ADD TABLE games;
   ```

3. Fill in your keys in `.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_SERVICE_KEY="your-service-role-key"
   PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

4. Seed:
   ```bash
   npm run seed:supabase
   ```

5. Set `DB_BACKEND=supabase` in `.env` and restart.

6. Open two browser tabs — vote in one, watch the other auto-update.

---

## Classroom Demo Flow

This is a suggested order for a live teaching session:

### Step 1 — Start with Mock (10 min)
- Run the app with `DB_BACKEND=mock`
- Walk through `src/db/types.ts` — the 5-method contract
- Show `src/db/mock.ts` — "this is just an array"
- Demo: add, vote, delete. Restart server — data is gone
- **Key takeaway**: We have a working app. Now we plug in real databases.

### Step 2 — Add PostgreSQL with Prisma (15 min)
- Show `prisma/schema.prisma` — how the Game model maps to SQL
- Show `src/db/prisma.ts` — same 5 methods, now with Prisma
- Switch to `DB_BACKEND=prisma`, restart, show it works
- Restart server — data persists!
- **Key takeaway**: Type-safe ORM, migrations, same interface.

### Step 3 — Add MongoDB with Mongoose (15 min)
- Show `src/db/mongoose.ts` — different paradigm, same contract
- Point out: `$inc` for atomic votes, `_id` → `id` mapping
- Switch to `DB_BACKEND=mongoose`, restart
- **Key takeaway**: Document DB vs relational. The UI didn't change.

### Step 4 — Add Supabase with Realtime (15 min)
- Show `src/db/supabase.ts` — REST-style API client
- Show the inline realtime script in `index.astro`
- Switch to `DB_BACKEND=supabase`, restart
- Open two tabs side by side — vote in one, watch the other update
- **Key takeaway**: Same CRUD + realtime for free. BaaS approach.

### Step 5 — Compare & Discuss (10 min)
- Open all 4 files in `src/db/` side by side
- All implement the same `DbClient` interface
- Discuss trade-offs: setup complexity, features, hosting, cost
- Click "Reset Data" to restore seed data between demos

### Tips
- Use the colored badge in the UI to confirm which backend is active
- Use "Reset Data" between demos to restore a clean state
- Have Docker running before class for Postgres and MongoDB
- Pre-configure `.env` files for each backend (or use separate `.env.prisma`, `.env.mongoose`, etc.)

---

## Database Management Tools

GUI tools to inspect your data while developing or demoing:

### PostgreSQL

| Tool | Type | Notes |
|---|---|---|
| **Prisma Studio** | Built-in | `npx prisma studio` — opens a browser UI to view/edit rows. Already installed! |
| **pgAdmin** | Web app | `docker run -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=admin@admin.com -e PGADMIN_DEFAULT_PASSWORD=admin dpage/pgadmin4` |
| **TablePlus** | Desktop app | [tableplus.com](https://tableplus.com) — free tier, macOS native, clean UI |
| **DBeaver** | Desktop app | [dbeaver.io](https://dbeaver.io) — free, supports every database |

> Quickest option: `npx prisma studio` — zero setup, already part of this project.

### MongoDB

| Tool | Type | Notes |
|---|---|---|
| **MongoDB Compass** | Desktop app | [mongodb.com/products/compass](https://www.mongodb.com/products/compass) — official GUI, free |
| **mongosh** | CLI | `docker exec -it games-mongo mongosh games_voting` — interactive shell |
| **Mongo Express** | Web app | `docker run -p 8081:8081 -e ME_CONFIG_MONGODB_URL=mongodb://host.docker.internal:27017 mongo-express` |

> Quickest option: **MongoDB Compass** — download, connect to `mongodb://localhost:27017`, browse `games_voting` collection.

### Supabase

| Tool | Type | Notes |
|---|---|---|
| **Supabase Dashboard** | Web app | Built into your project at [app.supabase.com](https://app.supabase.com) — Table Editor, SQL Editor, Realtime Inspector |
| **Supabase CLI** | CLI | `npx supabase inspect db table-sizes` — local inspection tools |

> Quickest option: The **Supabase Dashboard** is already there — Table Editor tab lets you browse and edit rows directly.

### Works with any backend

| Tool | Type | Notes |
|---|---|---|
| **DBeaver** | Desktop app | Connects to Postgres, MongoDB, and more from one app |
| **TablePlus** | Desktop app | Same — multi-database support in a single window |
| **VS Code extensions** | IDE | "Database Client" extension for Postgres/Mongo inside your editor |

---

## Project Structure

```
src/
├── db/
│   ├── types.ts       # Game + DbClient interface (the contract)
│   ├── index.ts       # Factory: picks backend from DB_BACKEND
│   ├── mock.ts        # In-memory array
│   ├── prisma.ts      # PostgreSQL via Prisma
│   ├── mongoose.ts    # MongoDB via Mongoose
│   └── supabase.ts    # Supabase (SQL + Realtime)
├── seed/
│   └── games.ts       # Shared seed data (6 games)
├── layouts/
│   └── Layout.astro   # HTML shell + minimal CSS
├── components/
│   ├── GameList.astro  # Renders list of GameCards
│   ├── GameCard.astro  # Single game: name, votes, buttons
│   ├── AddGameForm.astro
│   └── RealtimeBadge.astro  # Pulsing "LIVE" (Supabase only)
└── pages/
    ├── index.astro    # Main page
    └── api/
        ├── games/index.ts       # GET all / POST new
        ├── games/[id]/vote.ts   # POST vote
        ├── games/[id]/index.ts  # DELETE
        └── seed.ts              # POST reset
```
