# Pokédex Deck — Design System

Extracted from **Front End Ex.3 — Astro Pokédex.pptx** (theme `Simple Light`, 9 slides).
This document captures the styling so future decks can stay visually consistent.

---

## 1. Layout

- Slide format **16:9**, dimensions 10″ × 5.625″ (PptxGenJS `LAYOUT_16x9`).
- Single **flat, full‑bleed background** colour on every slide — no gradients, no decorative borders, no page numbers.
- Margins are roughly **0.5″** from each edge. Content lives in a wide loose grid with generous whitespace.
- Title slide uses a **two‑zone composition**: text on the left ~45 % of the canvas, an illustrative image taking the right ~55 %.
- Content slides are **mostly text on the left**, with optional supporting screenshots/illustrations placed freely (often top‑right or bottom‑right).
- Closing slide is **centred large headline** on the off‑white background, no decoration.

---

## 2. Colour palette

| Role | Hex | Notes |
|---|---|---|
| **Background — paper** | `F4F7F6` | Warm off‑white. Used on every slide, including title and closing. |
| **Foreground — primary text** | `08170F` | Near‑black with a very faint green tint. Used for the brand title and any "headline" text. |
| **Foreground — body text** | `000000` | Pure black, used for paragraphs, bullets and run‑of‑the‑mill copy. |
| **Accent — green callout** | `188038` | Google‑green. Used for inline "try it" badges, buttons, and code highlights. |
| **Accent — coral red (theme)** | `F9744D` | The deck's `accent1` theme colour. Comes through mostly via imagery (the red Pokédex illustration on the title slide). Reserve this for visuals, not text. |
| **Accent — sage / mint (theme)** | `6BAB90` / `A4CCBB` | Available in the theme but unused on slides. Good for secondary tags if needed. |
| **Accent — cyan (theme)** | `3EABCA` | Available in the theme; reserved. |

Rules of thumb:

- Pages are dominated by **paper + black** (≈ 90 %).
- One image per slide carries the colour. Don't add coloured shapes, ribbons or accent bars — the original deck doesn't.
- Hyperlinks are NOT recoloured; underline only.

---

## 3. Typography

Three typefaces are used. All are Google Fonts; PowerPoint will substitute if missing.

| Role | Family | Weight | Used for |
|---|---|---|---|
| **Display** | `Krona One` | Regular (the only weight) | Title‑slide brand wordmark. *Only* on slide 1 and slide 9. |
| **UI / Body** | `Inter Medium` | Medium 500 | Everything else: titles, subtitles, paragraphs, bullets, captions. |
| **Monospace** | `Roboto Mono` | Regular | Code samples, URL pills, "try it now" badges, anything technical. |

### Sizes (in points)

| Element | Size |
|---|---|
| Title‑slide brand wordmark (Krona One) | **36 pt** |
| Title‑slide eyebrow ("Front End. Practice 3", Krona One) | **10 pt** |
| Slide title (Inter Medium, bold optional) | **18 pt** |
| Body / bullet text (Inter Medium) | **11 pt** |
| Caption / footnote (Inter Medium) | **8 pt** |
| Closing headline ("Thank you for your time", Krona One) | **36 pt** |
| Code or monospace inline (Roboto Mono) | **11 pt** |

### Weight & emphasis

- Inter Medium is already a medium weight — avoid stacking `bold` on top of it for emphasis.
- Use **underline + bold** sparingly for inline links / "try it now" calls.
- All caps is **not used**. Sentence case throughout.

---

## 4. Slide patterns

### Title slide

- Background `F4F7F6`.
- Left zone (≈ x 0.5″ → 4.5″, y 0.7″ → 3.5″): two stacked Krona One text blocks — small eyebrow line, then the big multi‑line wordmark.
- Right zone (≈ x 4.5″ → 10″): one large illustrative image bleeding to the right edge. This image is the only colour the slide carries.
- No subtitle, no taglines, no progress dots.

### Content slide

- Background `F4F7F6`.
- A single short title in Inter Medium 18 pt at the top‑left.
- Body content: Inter Medium 11 pt paragraphs and bullets, left‑aligned, with one or two screenshots / illustrations placed loosely to the right or below.
- **No** chips, pills, accent bars, drop shadows, dividers or footers.
- Numbered sections are written inline as part of the title text, e.g. `01. Understand the Poké API:` — they are *not* a separate styled badge.

### Bullet style

- Plain disc bullet, no custom glyphs.
- Bullets sit close to their content (no extra paragraph spacing).
- Sub‑bullets are simply indented further with the same disc style.

### Closing slide

- Same paper background.
- One centred line of Krona One 36 pt: "Thank you for your time 😊". Optional emoji is welcome.

---

## 5. Imagery

- Each step in the deck is illustrated with **one screenshot** of the working result (UI mockup, gallery, detail page, etc.).
- Screenshots are placed **as‑is**, no rounded corners, no drop shadows, no border.
- Images are aligned to the right side of the slide, balancing the body text on the left.
- The title slide uses one **large hero illustration** that carries the deck's only saturated colour.

---

## 6. Voice & content rhythm

- Section titles begin with a two‑digit number and a period: `01.`, `02.`, `03.`…
- Each numbered slide explains **one task** in two short paragraphs or a short bullet list.
- Tone is direct, instructional, second person ("Create your own…", "Add a third page…").
- The deck always ends with **two slides**: a "Feature Ideas for Enhancements" list, then the closing thank‑you.

---

## 7. What NOT to do

- Don't add coloured backgrounds, gradients, ribbons, accent bars, side rails or dark hero blocks.
- Don't introduce extra typefaces. Three is the budget: Krona One, Inter Medium, Roboto Mono.
- Don't add page numbers or footers — the deck has none.
- Don't use ALL CAPS micro‑labels or pill chips. The Pokédex deck never does.
- Don't use drop shadows on cards. Cards aren't even part of this style — content sits directly on the paper.
- Don't add coloured headings. Headings are dark `08170F`/`000000`. Colour comes from one image per slide.

---

## 8. Quick reference for new decks

```
background     #F4F7F6
text primary   #08170F   (Krona One titles)
text body      #000000   (Inter Medium body)
accent green   #188038   (Roboto Mono inline)

display font   Krona One        36pt        (title-slide + closing only)
ui font        Inter Medium     11pt body / 18pt title / 8pt caption
mono font      Roboto Mono      11pt
```
