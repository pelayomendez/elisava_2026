# Guide — Agentic IDEs

> Draft outline. Sections marked *(verify)* contain vendor facts that change often.

## 1. What a coding agent is

- A language model in a loop: read context → plan → call tools (read, edit, run) → observe → repeat.
- Difference from autocomplete and from chat: the agent acts on your repo and your terminal.
- Vibe coding raises the floor; agentic engineering raises the ceiling. You own the spec, the review and the verification.

## 2. The landscape *(verify)*

- **IDE agents:** Cursor, GitHub Copilot agent mode, Zed, Kiro, Antigravity.
- **CLI / desktop / cloud agents:** Claude Code, OpenAI Codex, Antigravity CLI; background agents that open pull requests.
- **App builders:** Lovable, Bolt, v0, Replit, Figma Make — fast prototypes, little control.
- How to choose: where it runs, what it can touch, limits and price, student access.

## 3. Context engineering

- Why output quality follows context quality.
- `AGENTS.md`: the portable project brief (why, what, principles, constraints, how to run and test). Tool-specific variants (e.g. `CLAUDE.md`).
- Skills (`SKILL.md`): reusable, named workflows the agent loads on demand.
- Keep context small and true; delete what's stale.

## 4. MCP — giving the agent tools

- What the Model Context Protocol is and why it is a shared standard.
- Course servers: Figma (design → code), browser (Chrome DevTools / Playwright), database.
- Risk: every server is a new door. Only connect what you trust.

## 5. The working method

1. **Plan** — use plan mode; ask the agent to explain the approach before it edits.
2. **Spec** — goal, user, constraints, acceptance criteria, edge cases. Chapter 03 turns this into a method: [Spec-driven development with OpenSpec](../03-spec-driven-development/guide.md).
3. **Build in small increments** — one change, one commit.
4. **Verify** — read the diff, run it, test it, check it in the browser. Reject and rework.
- Parallel work: subagents, background agents, git worktrees.

## 6. When not to use an agent

- When you are learning the concept for the first time.
- When you can't verify the result.
- When the task touches secrets, personal data or someone else's system.

## 7. Cost, privacy and security

- Limits and credits; why cheap tiers run out.
- What leaves your machine; never paste secrets; `.env` and `.gitignore`.
- Permissions and approvals; prompt injection from web pages, issues and MCP output.

## 8. Checklist: reviewing an agent's change

- Does it do what the spec says, and nothing else?
- Can I explain every line?
- Did it add dependencies, files or config I didn't ask for?
- Does it run, pass tests and look right in the browser?
