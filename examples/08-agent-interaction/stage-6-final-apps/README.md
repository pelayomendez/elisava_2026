# Stage 6: Final User Apps

This stage turns the Cloudflare agent into the simplest real product for the user.

The key idea is:

1. one shared product spec
2. one shared Cloudflare backend
3. two client apps built from the same spec

Those two apps are:

- a desktop-first React app
- a React Native mobile app

Both apps talk to the stage 5 Cloudflare Worker.

## Goal

Show how the agent stops feeling like a developer exercise and becomes a user-facing product.

The apps should stay simple:

- show today's message
- let the user ask for a new coaching reply
- show recent memory / history from D1
- trigger a proactive Slack reminder when needed

## Architecture

```txt
Shared product spec
-> React desktop app
-> React Native app

Both apps
-> Cloudflare Worker
-> D1 database
-> optional Slack notification
```

## Folder

```txt
stage-6-final-apps/
  specs/
    FINAL_APP_SPEC.md
    API_CONTRACT.md
  desktop-react-app/
    package.json
    tsconfig.json
    vite.config.ts
    index.html
    .env.example
    src/
      main.tsx
      App.tsx
      styles.css
  mobile-react-native-app/
    package.json
    app.json
    .env.example
    App.tsx
```

## How it works

Stage 6 does not replace stage 5.

Instead:

- stage 5 is the cloud backend
- stage 6 is the user-facing frontend layer

The apps call these stage 5 endpoints:

- `GET /health`
- `GET /agent/memory`
- `GET /agent/runs`
- `POST /agent/run`
- `POST /agent/notify`

## One spec, two apps

The spec lives here:

- [FINAL_APP_SPEC.md](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-6-final-apps/specs/FINAL_APP_SPEC.md)
- [API_CONTRACT.md](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-6-final-apps/specs/API_CONTRACT.md)
- [SAMPLE_APP_GENERATION_PROMPT.md](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-6-final-apps/specs/SAMPLE_APP_GENERATION_PROMPT.md)

This is the teaching point of stage 6:

- define the experience once
- implement it twice
- keep both apps thin because the real intelligence stays in the agent backend

## Regenerating the apps from specs

Stage 6 also includes a sample classroom prompt you can reuse later to regenerate both apps from the written specs:

- [SAMPLE_APP_GENERATION_PROMPT.md](/Users/pomf/Experimental/elisava_temp/agent-interaction/stage-6-final-apps/specs/SAMPLE_APP_GENERATION_PROMPT.md)

This is useful for demonstrating that:

- the spec is the durable product definition
- the apps are one possible implementation
- the same spec can drive more than one frontend

## Desktop app

This is a desktop-first React app using Vite.

It can also later be wrapped in Electron or Tauri, but for the exercise we keep it as plain React so the product idea stays easy to understand.

### Run it

```bash
cd desktop-react-app
npm install
cp .env.example .env
npm run dev
```

By default it expects the Worker at:

```txt
http://localhost:8787
```

Set another backend URL in:

```txt
VITE_AGENT_BASE_URL=https://your-worker.your-subdomain.workers.dev
```

## Mobile app

This is a simple React Native app using Expo conventions.

It is aligned with Expo SDK 54 so it matches current Expo Go builds more reliably.

### Run it

```bash
cd mobile-react-native-app
npm install
cp .env.example .env
npx expo start
```

Set the backend URL in:

```txt
EXPO_PUBLIC_AGENT_BASE_URL=https://your-worker.your-subdomain.workers.dev
```

## Why this stage is useful

Earlier stages answer:

- what is the agent contract?
- how do we run it?
- how do we stream it?
- how do we background it?
- how do we deploy it?

Stage 6 answers:

- what does the actual user app look like?

## Final product idea

The simplest product shape is:

- the user opens the app
- sees today's coaching message
- sees a tiny history of recent runs
- can ask for a new suggestion
- can trigger a reminder

Everything else stays behind the scenes in Cloudflare.

## Notes

- The apps are intentionally thin and backend-driven.
- The database is read through the Worker, not directly from the apps.
- That keeps D1 private and makes both apps simpler.
- If you later want authentication, it belongs between the apps and the Worker.

## What to learn

Stage 6 demonstrates a clean product layering:

- one agent spec
- one cloud backend
- many user interfaces

That is the simplest path from experiment to product.
