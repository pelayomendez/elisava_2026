# Guide — Spec-driven development with OpenSpec

> Builds on the plan → build → verify loop from [02 · Agentic IDEs](../02-agentic-ides/guide.md). From this chapter on,
> every build uses it: [04 · Design](../04-design-to-code/README.md), [05 · Astro](../05-astro-with-agents/README.md)
> and the [final project](../09-final-project/guide.md).
> Checked against the OpenSpec docs in November 2026 (OpenSpec 2.x). Tools move fast: if a command here
> fails, `openspec --help` and [openspec.dev/docs](https://openspec.dev/docs) win.

## 1. Why specs

An agent writes code faster than you can read it. What it can't do is guess what you meant.
When the intent lives only in a chat, three things go wrong:

- **Drift.** Each prompt nudges the result a little further from what you wanted, and nobody wrote down what that was.
- **No review baseline.** You can't judge a diff if there is nothing to judge it against.
- **Lost context.** Close the chat and the reasons are gone. The next session (or the next agent) starts from zero.

Spec-driven development (SDD) fixes the order: **agree on what to build, in writing, before any code is written.**
The spec is the contract between you and the agent. You review it the way you would review code, because it is
cheaper to fix a sentence than a feature.

| Vibe coding | Spec-driven |
|---|---|
| Prompt → code → "looks fine" | Proposal → spec → tasks → code → verify against the spec |
| The chat is the record | The repo is the record |
| You review the result | You review the intent first, then the result |
| Fast to start, hard to change | Slower to start, safe to change |

SDD is not waterfall. A change is small (one feature, one fix) and the spec only describes **what changes**.

## 2. What OpenSpec is

[OpenSpec](https://github.com/Fission-AI/OpenSpec) is an open-source, tool-agnostic SDD framework. It adds:

- an `openspec/` folder in your repo with the **current specs** and the **changes in progress**;
- **skills** your agent can run (`openspec-propose`, `openspec-apply-change`, …) in Claude Code, Cursor, Copilot, Codex, Antigravity and 30+ other tools;
- a **CLI** (`openspec`) to list, show, validate and archive changes from the terminal.

Other SDD tools exist (GitHub Spec Kit, Kiro's built-in specs). We use OpenSpec because it is light, works with any
agent the class uses, and its specs are plain Markdown you can read on GitHub.

## 3. Install and set up

Needs Node.js 22.20 or later (`node -v`).

```bash
npm install -g @fission-ai/openspec@latest   # or: brew install openspec
cd my-project
openspec init                                # pick your agent(s) when asked
```

`init` creates:

```text
openspec/
├── config.yaml          # project context the agent reads every time
├── specs/               # the source of truth: how the app behaves today
└── changes/             # one folder per change in progress
    └── archive/         # finished changes, dated
.agents/skills/openspec-*/SKILL.md   # the skills (linked for tools that need it)
```

Fill in `openspec/config.yaml` before your first change. This is the project context; keep it short:

```yaml
schema: spec-driven
context: |
  Astro 6 site, Tailwind v4, deployed to GitHub Pages.
  Data from PokéAPI (https://pokeapi.co). No backend.
  Accessibility: semantic HTML, keyboard navigable, alt text on every image.
  Tests: none yet; verify in the browser.
```

> `config.yaml` says **what the project is**. `AGENTS.md` says **how to work in it** (commands, conventions,
> what not to touch). Keep both; don't copy one into the other.

## 4. The loop: explore → propose → apply → archive

```text
 explore ──► propose ──► (review) ──► apply ──► verify ──► archive
 think       write the    you edit     agent      you       specs updated,
 freely      plan         the plan     codes      check     change filed
```

In Claude Code you type the skill name as a slash command (`/openspec-propose`); in Codex use `$openspec-propose`.
You can also just ask: *"use openspec to propose a search box"*.

| Step | Skill | What happens | Your job |
|---|---|---|---|
| Explore | `openspec-explore` | The agent reads the code and talks through options. Writes nothing. | Decide what you actually want. |
| Propose | `openspec-propose` | Creates `openspec/changes/<name>/` with proposal, delta specs, design and tasks. | **Read and edit every file.** This is the main review. |
| Update | `openspec-update-change` | Revises the planning files so they stay consistent. Never touches code. | Use it when you change your mind mid-plan. |
| Apply | `openspec-apply-change` | Works through `tasks.md`, writes code, ticks boxes. | Watch, stop it early if it drifts, review the diff. |
| Archive | `openspec-archive-change` | Merges the delta specs into `openspec/specs/` and moves the change to `archive/YYYY-MM-DD-<name>/`. | Only after you verified the result. |

Start apply in a **fresh chat**: the plan is in the files, not in the conversation, and a clean context
follows it better.

> Coming from OpenSpec 1.x? The old `/opsx:propose`, `/opsx:apply`, `/opsx:archive` commands became skills in 2.0.
> Run `openspec update` in the project to migrate.

## 5. Anatomy of a change

```text
openspec/changes/add-type-filter/
├── proposal.md     # why and what (scope in / out)
├── design.md       # how (decisions, files touched)
├── tasks.md        # the checklist the agent follows
└── specs/
    └── gallery/
        └── spec.md # delta: what the gallery must now do
```

### proposal.md — why and what

```markdown
# Proposal: Filter the gallery by type

## Intent
Users can't find Pokémon of one type without scrolling 150 cards.

## Scope
In scope: a type filter on the gallery page; the selected type in the URL.
Out of scope: multi-type filters, search by name.

## Approach
Static filter buttons generated from the types in the data; filter on the client.
```

### Delta spec — what must be true

Requirements use **SHALL / MUST** (mandatory) and **SHOULD / MAY** (optional). Each one has at least one
**scenario** you can check by hand or with a test.

```markdown
# Delta for Gallery

## ADDED Requirements

### Requirement: Type filter
The gallery SHALL let the user show only Pokémon of one type.

#### Scenario: Pick a type
- GIVEN the gallery shows all Pokémon
- WHEN the user selects "Fire"
- THEN only Fire-type Pokémon are shown
- AND the URL contains `?type=fire`

#### Scenario: Shared link
- GIVEN a link to `/gallery?type=water`
- WHEN the page loads
- THEN only Water-type Pokémon are shown

## MODIFIED Requirements

### Requirement: Gallery order
The gallery SHALL sort the visible Pokémon by Pokédex number.
(Previously: sorted by name)
```

Sections: `ADDED` (new behaviour), `MODIFIED` (changed behaviour, with what it was before), `REMOVED`.
On archive, ADDED is appended to `openspec/specs/gallery/spec.md`, MODIFIED replaces the old requirement and
REMOVED deletes it.

### design.md — how

Short. Decisions with their reason, and the files that change. Skip it for trivial changes.

### tasks.md — the checklist

```markdown
# Tasks

## 1. Data
- [ ] 1.1 Collect the list of types at build time (verify: list printed in dev log)

## 2. UI
- [ ] 2.1 Filter buttons above the grid, keyboard focusable (verify: Tab reaches them)
- [ ] 2.2 Read and write `?type=` in the URL (verify: scenario "Shared link")
- [ ] 2.3 Sort by Pokédex number (verify: first card is #001)
```

Every task says how it is verified. If you can't write the check, the task is too vague.

## 6. Terminal commands

The skills run in the agent chat. The CLI runs in your terminal and doesn't need an agent:

```bash
openspec list                 # changes in progress (--specs for current specs)
openspec show add-type-filter # print a change or a spec
openspec view                 # interactive dashboard
openspec validate --all       # check the format of every change and spec
openspec archive add-type-filter
openspec update               # refresh the skills after upgrading OpenSpec
```

Run `openspec validate` before you commit a change. A change with no delta spec fails validation: that usually
means you planned code without saying what behaviour changes.

## 7. Reviewing a proposal

Before you say "apply", check:

- [ ] The **intent** is one or two sentences a classmate would understand.
- [ ] **Out of scope** is written down. Agents love to add extras.
- [ ] Every requirement has a scenario, and every scenario has a THEN you can observe.
- [ ] No scenario depends on something you can't check (timing, "looks good", "fast").
- [ ] Tasks are small enough that one task is one commit.
- [ ] Nothing in the design touches secrets, other people's data or files outside the project.

After apply, review the diff **against the scenarios**, not against your memory of the chat. Anything in the diff
that no scenario asks for is a question for the agent.

## 8. When to use it, and when not

Use a spec for anything that adds or changes behaviour someone will rely on: a feature, an API, a data model.

Skip it for typo fixes, styling tweaks, throwaway prototypes, or when you are still exploring what to build
(use `openspec-explore`, or a plain chat, then propose once you know).

**Rule for this course:** from this chapter on, every exercise is delivered with its `openspec/` folder.
Your git history should show changes proposed, applied and archived. In the final project, the archived
changes are part of the review log.

## 9. Exercise

In your Ex.2 repo (the Pokédex with its `AGENTS.md`):

1. `openspec init`, fill in `config.yaml`.
2. Explore one small feature with the agent. Write down the option you picked and why.
3. Propose it. Edit the proposal until the review checklist (section 7) passes. Commit the plan alone.
4. Apply it in a fresh chat. Commit the code.
5. Verify every scenario by hand, then archive. Commit.

Deliver: the repo link, with three commits (plan, code, archive) visible in the history.

## Further reading

- [OpenSpec on GitHub](https://github.com/Fission-AI/OpenSpec) and [docs](https://openspec.dev/docs)
- [Upgrade to 2.0](https://openspec.dev/docs/upgrade-to-2)
- Last year's slides on specs: [§4 spec-driven development](../../content/section4-slide03.html)
