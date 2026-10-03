# Sample App Generation Prompt

Use this prompt later in class to show how the stage 6 apps can be regenerated from the specs.

## Prompt

```txt
Build the final user-facing Better Me apps from the provided specs.

Context:
- Read FINAL_APP_SPEC.md first.
- Read API_CONTRACT.md second.
- The backend already exists as a Cloudflare Worker.
- The apps must talk only to the Worker API, never directly to D1.

Your task:
1. Create a desktop-first React app.
2. Create a React Native app.
3. Keep both apps intentionally simple.
4. Use the same product structure in both apps.
5. Make the backend URL configurable through environment variables.

Desktop app requirements:
- React + Vite
- Show today's latest coaching message
- Show recent memory items
- Show recent runs
- Allow the user to submit a manual message to POST /agent/run
- Allow the user to trigger a reminder with POST /agent/notify
- Keep the layout clean and calm

Mobile app requirements:
- React Native / Expo style
- Same core features as the desktop app
- One-screen-first layout
- Easy to use with one hand

Shared UI behavior:
- Handle loading states
- Handle backend errors clearly
- Keep copy friendly and minimal
- Do not add authentication
- Do not add advanced settings
- Do not add analytics

Files to use as source of truth:
- FINAL_APP_SPEC.md
- API_CONTRACT.md

Output:
- one desktop app folder
- one mobile app folder
- short README instructions for running each app

Design direction:
- warm
- calm
- human
- simple
- not overly technical
```

## How to use it in class

Suggested flow:

1. Show the product spec.
2. Show the API contract.
3. Paste this prompt into the coding agent.
4. Compare the generated apps to the reference stage 6 apps.
5. Discuss what stayed consistent because the spec was clear.

## Teaching point

The important lesson is not “the agent made a UI by magic.”

The important lesson is:

- good specs create repeatable outputs
- a shared backend simplifies multiple clients
- one product idea can become many interfaces
