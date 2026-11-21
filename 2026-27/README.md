# Agentic Product Development — Edition 2026-2027

> Working title. First draft of the reorganisation; nothing here is final.

## Philosophy

> Software is an apprenticeship industry — you can only learn by doing. The industry changes fast, so developers have to keep learning. It takes many years to forge a competent software engineer.
>
> Senior software engineers don't only write code — they have to be able to understand, maintain, explain, and manage a large body of software in production over time and translate business needs into technical implementation.
>
> Writing code is the easiest part of software engineering, and it's getting easier every day. AI can help generate lots of code really fast, but it can't aid in the work of managing, understanding, or operating that code.
>
> Generated code can't be trusted — it needs to be reviewed before it can be committed and shipped to production.
>
> — Charity Majors, CTO of honeycomb.io

Agentic development is the default way of building from week 1. Students still learn how the
web works by hand, but the purpose shifts: from *writing* every line to *reading, judging and
steering* what an agent writes.

- **The human owns intent and verification.** Specs, review, tests and security are the student's job; the agent types.
- **Hand-made core, then compare.** Each fundamental is built once without an agent, then rebuilt with one and compared.
- **Ask, don't just delegate.** Using the agent to explain concepts builds skill; handing it the whole task erodes it (debugging most of all).
- **Tool-agnostic concepts.** We teach the shared vocabulary (AGENTS.md, Skills, MCP, plan mode, subagents, hooks) that every major agentic IDE now supports, not one vendor's buttons.
- **Assessment rewards understanding.** Every deliverable includes the spec, the agent context files and an oral "explain your diff".

Previous edition (2025-26): *"Learn to code well first; AI as a multiplier later"*
([objectives deck](../objetives/slide02.html)). This edition reverses the order of the second half of that sentence, not the first.

## Chapters

| # | Chapter | Focus |
|---|---|---|
| 00 | [Setup & mental model](00-setup/) | Terminal, git, how the web works, what an agent is |
| 01 | [Web fundamentals, hand-made](01-web-fundamentals/) | HTML, CSS, JS, the html-pokédex |
| 02 | [Agentic IDEs](02-agentic-ides/) | **New core chapter**: tools, context, MCP, plan → build → verify |
| 03 | [Spec-driven development](03-spec-driven-development/) | **New**: specs before code with OpenSpec — propose, apply, verify, archive |
| 04 | [Design to code](04-design-to-code/) | Figma MCP, Tailwind v4, components, browser-driving agents |
| 05 | [Astro with agents](05-astro-with-agents/) | Components, routing, Astro 6, deploy; built with OpenSpec |
| 06 | [Data](06-data/) | APIs, SQL/NoSQL, Supabase, realtime subscriptions |
| 07 | [AI inside the product](07-ai-in-the-product/) | LLM APIs, structured output, one backend |
| 08 | [Realtime & agents as product](08-realtime-and-agents/) | SSE/WebSockets, Agent Wars, n8n, background agents |
| 09 | [Final project](09-final-project/) | Spec → agent build → review → oral defence |

## Chapter layout

Each chapter is one folder that ties together what is taught, practised and looked up:

```
NN-chapter/
  slides.html  in-class deck: one <section class="slide"> per slide
  guide.md     reference to read after class (Markdown; also usable as agent context)
  README.md    session plan, learning goals, reuse map, open items
```

**Slides vs guides:** slides carry the in-class story, one idea per slide; guides hold the
reference and code. Long code dumps move from slides to guides. Guides are written in Markdown
so students can hand them to their own agent as context.

Last year's reference guides (terminal, git, CSS, JS) stay where they are under `content/guides/`
and are listed as foundations in `assets/course.js`.

**Living guides** live in `guides/` and change during the year. [State of AI coding](guides/state-of-ai-coding.md)
is the running log of what changed in AI coding; we add to it in class (one line, one source).

## Reuse

Existing material stays where it is and is linked from each chapter's README under **Reuses**:
`content/` (slides, guides, decks), `examples/`, `demos/`, `tools/`, `deliverables/`.

## Website

Plain HTML, CSS and JS — no build step — published by GitHub Pages from the repo root at
`/2026-27/` (`.nojekyll` keeps Jekyll away from the Markdown).

- `index.html` — course landing: learning path, chapter cards, guides, projects, decks.
- `NN-chapter/slides.html` — the chapter deck. Keys: `←` `→` move (and flow into the next chapter), `O` overview, `F` fullscreen, `Esc` back to the landing. Print to PDF gives one slide per page.
- `doc.html#/NN-chapter/guide.md` — renders guides and plans with [marked](https://marked.js.org).
- `assets/course.js` — single source for chapters, guides, projects and decks. Add a chapter there and it appears everywhere.
- Gaps: `<div class="todo">` in slides and `_To write._` in guides show as orange "TO FILL" boxes.
- Local preview: from the repo root run `python3 -m http.server` and open `http://localhost:8000/2026-27/` (`file://` can't load the Markdown).
- Links in Markdown: `.md` open inside the site; `content/` and `objetives/` HTML open on Pages; PDFs, decks (Git LFS, not served by Pages) and source folders open on GitHub.

## Open decisions

- [ ] Recommended default tool for students (GitHub Copilot Student is free; Cursor's student year closed; Claude has no individual student tier) — or stay fully tool-agnostic. Ask Elisava about institutional licences.
- [ ] One backend language for chapters 06-07 (Python or Node).
- [ ] Guides: rendered by a small Astro site (which doubles as a course example) or plain HTML template.
- [ ] Rebuild the image-only NotebookLM decks as HTML slides, or keep them as handouts.
- [ ] Session count and calendar mapping per chapter.
- [ ] Course language for slides (current material mixes English and Spanish).

## Facts to verify before class

Tool names, prices, quotas and student programmes change monthly. Everything vendor-specific in
these drafts was researched in November 2026 from mostly secondary sources and must be checked
against official pages before it reaches a slide.
