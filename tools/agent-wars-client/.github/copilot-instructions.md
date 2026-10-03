# Honest Driven Development

This project uses the HDD workflow: **define ↔ build → close**.

## How it works

Specs live in `.hdd/specs/`. Functional specs live in `.hdd/functional-specs/`.

Before writing code, the user will describe what they want in plain language. Follow the workflow below.

## Workflow

### Define (when the user describes a new feature or idea)

1. Read `AGENTS.md` for project context.
2. Read `AUTHOR.md` if it exists, to understand the user's role and preferences.
3. Create a spec in `.hdd/specs/YYYY-MM-DD-short-slug.md` with this structure:
   - Summary, Why, Requested outcome, Users affected, Functional expectations, Acceptance criteria, Open questions, Functional impact, Build log, Closure
4. Set metadata: `status: defined`, `created: YYYY-MM-DD`, `updated: YYYY-MM-DD`
5. Focus on WHAT and WHY, not implementation.
6. Use simple, non-technical language.
7. Walk through open questions one at a time with the user.
8. If the feature impacts a functional domain from `AGENTS.md`, create or update a file in `.hdd/functional-specs/`.

### Build (when the user wants to refine or iterate on a spec)

1. Resolve the spec: if the user gives a keyword (e.g. "voting"), search `.hdd/specs/` for files whose name contains it. If multiple matches, ask which one. If a full path is given, use it directly.
2. Read the spec.
3. **Present a plan before making changes.** Explain in plain language: what you're going to change or build, why, and what's out of scope. Wait for the user to approve before proceeding.
4. Once approved, **write the plan to the `## Plan` section** of the spec. This replaces any previous plan.
5. Update only the sections that need changes — do not rewrite the entire spec.
6. Preserve the original Summary and Why unless explicitly asked to change them.
7. Append a dated entry to the Build log section. Each entry must include the approved plan and what was actually done.
8. Set metadata: `status: in-progress`, `updated: YYYY-MM-DD`

### Close (when the user says the work is done)

1. Resolve the spec: if the user gives a keyword, search `.hdd/specs/` for files whose name contains it. If multiple matches, ask which one.
2. Evaluate if the spec is ready to close.
2. If not, warn: "This spec still has open questions or evolving intent. Do you want to close anyway?"
3. Fill the Closure section: Delivered outcome, Deviations, Remaining open questions, References.
4. Set metadata: `status: closed`, `updated: YYYY-MM-DD`
5. Ask if the user wants to commit the closure.

## Rules

- Use `AGENTS.md` for project rules, `AUTHOR.md` for user preferences
- If there is a conflict, `AGENTS.md` wins for product decisions
- Do not include code in specs unless explicitly requested
- Use simple language — specs should be readable by non-technical people
- Specs are living documents that evolve over time
