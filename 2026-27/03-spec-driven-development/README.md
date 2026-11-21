# 03 — Spec-driven development

**New chapter.** Chapter 02 taught the loop: plan → build → verify. This chapter turns the plan into a
written, reviewable spec that lives in the repo, using OpenSpec. Every build after this one starts here.

## Learning goals

- Explain why a written spec beats a long prompt: drift, review baseline, lost context.
- Set up OpenSpec in a project and write its project context.
- Write requirements with SHALL/MUST and scenarios with GIVEN / WHEN / THEN.
- Take one change through explore → propose → review → apply → verify → archive.
- Review a proposal before any code exists, and review the diff against its scenarios.
- Decide when a spec is worth it and when it isn't.

## Session plan (draft)

1. **Why specs.** Live demo: the same feature from a one-line prompt and from a reviewed proposal. Compare the diffs.
2. **OpenSpec tour.** `openspec init`, the `openspec/` folder, `config.yaml` vs `AGENTS.md`.
3. **Writing specs.** Requirements and scenarios. Students rewrite three vague requirements into testable ones.
4. **The loop, hands on.** Propose a feature on the Pokédex, review it in pairs, apply in a fresh chat, verify, archive.

## Guide

See [guide.md](guide.md).

## Exercise

**Ex.3 — First spec.** One feature on your Pokédex through the whole OpenSpec loop. Deliver: the repository with
`openspec/`, three commits (plan, code, archive) and the archived change.

## Reuses

- Slides [§4 spec-driven development](../../content/section4-slide03.html): specs (03-05)
- Deck [Augmented Engineering](../../content/presentations/Augmented_Engineering.pdf) (define architecture → break down → build incrementally)

## New / to do

- Run `openspec init` in a test repo before class and confirm the 2.x skill names (`openspec-propose`, `openspec-apply-change`, `openspec-archive-change`).
- Prepare the demo repo for session 1 with both diffs ready.
- Pair-review worksheet for session 4, based on the checklist in the guide.
- Decide whether to show GitHub Spec Kit or Kiro specs as an alternative, or only mention them.
