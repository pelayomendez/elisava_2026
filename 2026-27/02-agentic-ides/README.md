# 02 — Agentic IDEs

**New core chapter.** Everything after this chapter is built with an agent, using the method taught here.

## Learning goals

- Place the main tools on a map: IDE agents, CLI agents, cloud/background agents, app builders.
- Explain the agent loop and why context decides output quality.
- Write an `AGENTS.md` for a project and a reusable skill.
- Connect an MCP server and say what it lets the agent do.
- Work plan → spec → small increments → verify, and review a diff before accepting it.
- Decide when *not* to use an agent; reason about cost, privacy and security.

## Session plan (draft)

1. **Landscape & the loop.** Vibe coding vs agentic engineering. Live demo: same task, vague prompt vs planned task.
2. **Context engineering.** AGENTS.md, rules, skills, slash commands. Students write AGENTS.md for their Pokédex.
3. **MCP & tools.** What MCP is; Figma, browser (Chrome DevTools / Playwright) and database servers.
4. **Plan, build, verify.** Plan mode, specs, small commits, reading diffs, tests, browser checks, subagents and background agents.

## Guide

See [guide.md](guide.md).

## Exercise (draft)

**Ex.2 — Agent onboarding.** Take the Ex.1 Pokédex, add an `AGENTS.md`, one skill and one MCP
server, then ship one feature through plan → spec → build → verify. Deliver: the repo, the spec,
the agent transcript summary and a short "what I rejected and why".

## Reuses

- Slides [§4 spec-driven development](../../content/section4-slide01.html): vibe-coding problem (02), specs (03-05), skills (06), MCP (07-08), best practices (11)
- Deck [Augmented Engineering](../../content/presentations/Augmented_Engineering.pdf) (define architecture → break down → build incrementally)
- Objectives deck [Module 5: coding with AI](../../objetives/slide05.html) (context engineering)
- [agent-wars-client AGENTS.md](../../tools/agent-wars-client/AGENTS.md) as a minimal real example

## New / to do

- Tool landscape slide (verify names and student tiers before class — see course README).
- Decide whether honest-dd (§4 slides 09-10) stays.
- Security & privacy session content: secrets, permissions, prompt injection via web pages and MCP.
