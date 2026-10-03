---
description: Evolve a spec — refine intent and build toward the outcome
---

## Command: /hdd.build

Iterate on an existing spec in `.hdd/specs/`.

### Input

${input:spec:Spec name or path (e.g. "voting" or ".hdd/specs/2026-04-01-voting.md")}
${input:refinement:What to refine or change (optional)}

### Steps

1. Read [AGENTS.md](../../AGENTS.md) for project context.
2. If [AUTHOR.md](../../AUTHOR.md) exists, read it for context.
3. Resolve the spec:
   - If the input is a full path (e.g. `.hdd/specs/2026-04-01-voting.md`), use it directly.
   - If it's a keyword (e.g. `voting`), search `.hdd/specs/` for files whose name contains the keyword.
   - If one match is found, use it.
   - If multiple matches are found, list them and ask the user which one.
   - If no match is found, tell the user no spec was found with that name.
4. Read the spec.
5. **Present a plan before making changes.** Based on the spec and the refinement (if any), explain in plain language:
   - What you're going to change or build
   - Why (how it connects to the spec's intent)
   - What's out of scope for this iteration
   Wait for the user to approve, adjust, or redirect before proceeding.
6. Once approved, **write the plan to the `## Plan` section** of the spec. This replaces any previous plan — the Plan section always reflects the current iteration's approved plan.
7. Apply changes to the relevant sections:
   - Functional expectations
   - Acceptance criteria
   - Open questions
   - Any section where the refinement applies
8. If no refinement is provided, review the spec and suggest next steps or ask clarifying questions.
9. Do NOT rewrite the entire spec blindly — preserve existing intent.
10. Append a dated entry to the **Build log** section. Each entry must include:
    - The plan that was approved
    - What was actually done
11. Resolve open questions when possible based on the refinement.

### AUTHOR.md support

- Use `AUTHOR.md` as contextual guidance, not as output content
- Adapt communication to the author's profile
- Prioritize `AGENTS.md` for project rules and `AUTHOR.md` for creator preferences

### Rules

- Always preserve the original Summary and Why unless explicitly asked to change them
- Do not include code unless the user asks for it
- Use simple language
- Update metadata: `status: in-progress`, `updated: YYYY-MM-DD`
- Each build iteration must add a Build log entry
- If the spec has no open questions and no refinement is given, suggest closing it

### Build log entry format

```markdown
### YYYY-MM-DD
- Plan: [what was approved]
- Done: [what was actually changed]
```
