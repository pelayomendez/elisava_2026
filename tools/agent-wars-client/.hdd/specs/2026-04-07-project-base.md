# Spec: Project Base with Vite

> status: closed
> created: 2026-04-07
> updated: 2026-04-07

## Summary
Set up the project foundation using Vite and React. The result is a single-page app with a clean starting point, ready to connect to a WebSocket server later.

## Why
The project needs a lightweight, fast development setup to build a real-time client. Vite provides quick builds and a simple developer experience, which aligns with the goal of keeping things simple and focused on learning.

## Requested outcome
A working Vite + React project with a single page. No routing needed. The page should be minimal and clean, serving as the base for future features like the Socket.io connection.

## Users affected
- The developer (Pelayo) — faster setup and easier development

## Functional expectations
- Running `npm run dev` starts the app locally
- The app shows a single page in the browser
- The page has a minimal, clean look
- The project uses React as required
- No unnecessary files or boilerplate left over from the Vite template

## Acceptance criteria
- Vite project is initialized with React
- The app runs without errors
- Only one page exists (no routing)
- Unused template files and boilerplate are removed
- The project structure is simple and easy to understand

## Open questions
- ~~Should the page show any specific content?~~ — No, blank page for now.

## Functional impact
- none

## Plan
- Initialize Vite + React (JavaScript) in the current directory
- Remove all Vite boilerplate (demo styles, logos, counter)
- Leave a blank page with an empty App component
- Keep existing project files untouched

## Build log

### 2026-04-07
- Plan: Initialize Vite + React (JS) project, remove boilerplate, leave blank page
- Done: Scaffolded Vite + React project, created clean App.jsx (empty fragment) and main.jsx, renamed package to agent-wars-client, set page title to "Agent Wars", removed demo assets/styles/README, installed dependencies, verified build passes

## Closure

### Delivered outcome
A clean Vite + React project with a single blank page. Runs with `npm run dev`, builds without errors, and has no leftover boilerplate. Ready for Socket.io integration.

### Deviations from original intent
- None

### Remaining open questions
- None

### References
- Commit: 538ce94
