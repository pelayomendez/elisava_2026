# Final App Spec

## Product

Better Me is a tiny personal coaching app.

The app should feel calm, supportive, and easy to open for 30 seconds.

## Primary user needs

The user wants to:

1. see today's habit prompt
2. ask for a new suggestion
3. remember what the agent already knows
4. receive reminders without managing a complex interface

## Core screens

### 1. Home

Shows:

- today's latest coaching message
- one short motivational line
- two quick actions:
  - `Ask again`
  - `Send reminder`

### 2. Memory

Shows:

- the current memory items the agent is using
- no editing UI in the first version

### 3. Recent activity

Shows:

- recent runs from the backend
- timestamp
- trigger mode
- short answer preview

## UX rules

- keep text large and readable
- keep the interface low-friction
- no dashboards full of controls
- the backend does the heavy lifting
- the app mostly displays state and triggers actions

## Functional requirements

- fetch current memory from the Worker
- fetch recent runs from the Worker
- send a manual user message to the Worker
- trigger a notification/reminder through the Worker
- handle loading and error states clearly

## Non-goals for this stage

- authentication
- onboarding
- push notifications from the phone OS
- editing memory directly in the client
- advanced analytics

## Desktop interpretation

The desktop app should feel like:

- a single-column daily companion
- useful on a laptop
- easy to wrap later in Electron or Tauri if needed

## Mobile interpretation

The mobile app should feel like:

- one-screen-first
- thumb-friendly
- quick to open and close

## Shared success condition

If a user can:

1. open the app
2. understand today's message
3. press one button to get another message
4. press one button to trigger a reminder

then the first product version is working.
