# 07 — AI inside the product

Chapter 02 is about AI that *builds* the software; this one is about AI that *is part of* the software.

## Learning goals

- Call an LLM API from the server and keep keys out of the client.
- Get structured output (JSON schema) and render it.
- Generate images and handle binary/base64 data.
- Build a small backend that proxies AI calls; handle CORS and deploy frontend and backend.

## Session plan (draft)

1. LLM APIs, keys and environment variables; first request.
2. Structured output; generated Pokémon.
3. Backend proxy and image generation.
4. Chatbot / interactive component; deploy the full stack.

## Guide

See [guide.md](guide.md).

## Reuses

- Slides [§2 AI integration](../../content/section2-slide01.html) (01-06, 10-12)
- Slides [§3 full stack](../../content/section3-slide01.html) (all)
- Examples: [04-flask-api](../../examples/04-flask-api/), [05-python-genpoem](../../examples/05-python-genpoem/), [06-nodejs](../../examples/06-nodejs/)
- Demo: [autonomous-game-studio](../../demos/autonomous-game-studio/)
- Objectives [Module 4](../../objetives/slide04.html)

## New / to do

- Merge §2 and §3 into one chapter with a single backend language (open decision).
- Update Gemini code: slides use the old `@google/generative-ai` SDK and `imagen-3.0` *(verify current SDK and models)*.
- Decide provider(s): Gemini, Mistral (used in demos), others.
