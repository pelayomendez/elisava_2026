# State of AI coding

**A living guide.** The tools in this course change faster than the course does. This page is the
running log of what changed and what it means for how we work. We update it during the year, in class.

_Last updated: 18 November 2026._

**See it in 3D:** [the interactive timeline](https://pelayomendez.github.io/ai-coding-timeline/)
([source](https://github.com/pelayomendez/ai-coding-timeline)). It is also an example of a prototype with
specification, data, design and code kept apart; we add new months to its `data/timeline.json` in class.

## TL;DR

No one is writing code anymore, and we are still figuring out what that means.

## A brief history of AI coding since November 2025

The original list is by Matt Pocock; the sources for each month are in the 3D timeline.

| When | What happened |
|---|---|
| Nov 2025 | Opus 4.5 releases. OpenClaw gets built. |
| Dec 2025 | The community agrees that models are good enough to handle 95% of coding tasks. |
| Jan 2026 | Ralph loops get popular. Early efforts on loops and orchestration. |
| Feb 2026 | Everyone feels knackered: too much strategic decision-making. Fears around cognitive debt begin. |
| Mar 2026 | Skills explosion, as the community converges on easy-to-share processes (Superpowers was already ahead of the game here). |
| Apr 2026 | Most state-of-the-art developers haven't written a line of code in months. |
| May 2026 | "The unreasonable effectiveness of HTML": more interest in richer review surfaces. |
| Jun 2026 | "Loop Engineering" wins vaguepost of the year, a sign of more hype around process. |
| Jul 2026 | Every talk at every conference becomes "here is my software factory". |
| Aug 2026 | Opus 5 speaks incomprehensibly. Interest in ASD-STE100 peaks. |
| Sep 2026 | Grok Bot gets popular. More interest in long-running "manager" threads that keep context and delegate work. |
| Oct 2026 | The promised speed gains haven't materialised. The "dark factory" still feels a long way off. |
| Nov 2026 | The No-slop manifesto is released. Reading the code still appears essential. |

## Words you will hear

- **Ralph loop.** Run the same prompt against an agent in a loop until the task is done. Brute force, sometimes effective.
- **Orchestration.** One agent splitting work and handing it to others, then checking what comes back.
- **Cognitive debt.** Code in your product that nobody on the team understands, because nobody wrote it.
- **Skills.** Packaged, shareable instructions an agent loads for a kind of task. See [chapter 02](../02-agentic-ides/guide.md).
- **Review surface.** Whatever you use to judge an agent's work: a diff, a spec, a rendered page, a test report.
- **Software factory / dark factory.** A pipeline where agents build software with little or no human in the loop. "Dark" as in a factory that runs with the lights off.
- **ASD-STE100.** Simplified Technical English: a controlled language with short sentences and a fixed vocabulary, written for manuals. People tried it on prompts and model output.

## What it means for this course

- **Writing code is the easy part.** The course is about specifying, reviewing and operating it. This is the point of the [Charity Majors quote](../README.md).
- **Specs before code.** When the agent writes everything, the spec is where your intent lives: [chapter 03](../03-spec-driven-development/guide.md).
- **Read the code.** Every exercise is reviewed by you before it is committed. "The agent said it works" is not a review.
- **Mind your energy.** Deciding all day is tiring. Keep changes small, so each decision is small.

## How we keep it updated

1. Something changes how we work: a model, a tool, a practice, a post everyone argues about.
2. Anyone in class proposes a line: **month, what happened, and a link to the source.**
3. We discuss it for five minutes at the start of the next session: does it change anything in the course?
4. If it does, we add it to the table and, where needed, to *What it means for this course*.

Rules: one line per event, past tense, a source for every new line. Opinions go in the discussion, not in the table.

## Discussion questions

- Which line in the table matches your own experience so far? Which one doesn't?
- If no one writes code, what does a junior developer practise?
- What would you need to see before trusting a "dark factory" with your final project?
