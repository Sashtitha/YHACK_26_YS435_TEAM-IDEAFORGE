# TransformAI — Challenge 25 Prototype

A working prototype for **Challenge 25: AI-Powered Multi-Format Content Transformation Platform**.
Paste or upload source material, choose your audience/tone/language/detail/objective/style, pick one
or more output formats, and generate a slide deck, social post, public advisory, video script, and/or
infographic — all grounded in one shared "fact graph" so they stay consistent with each other.

## Quick start

## 🌐 Live Demo

[TransformAI – Live Application](https://transformai-lxl0.onrender.com/)

## Going live with real AI generation

1. Get an API key at https://console.anthropic.com
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Put your key in `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Restart the server (`npm start`). The status card in the sidebar (and the terminal log) will say
   **LIVE** instead of **DEMO**.

If a live Claude call ever fails mid-request (bad key, rate limit, network blip), that single request
quietly falls back to demo mode instead of crashing — useful insurance on demo day.

## How it works

```
Source text  →  Fact extraction (1 Claude call)  →  Fact graph (JSON)
                                                          │
                                    ┌─────────────────────┼─────────────────────┐
                                    ▼                     ▼                     ▼
                              Slide deck            Social post        Advisory / Video / Infographic
                          (1 Claude call each, all grounded in the SAME fact graph + your parameters)
                                    │
                                    ▼
                   Lightweight consistency check (flags numbers not in the fact graph)
```

- `lib/prompts.js` — every prompt template (fact extraction + one per output format).
- `lib/anthropic.js` — thin wrapper around the Claude Messages API.
- `lib/mock.js` — the demo-mode fallback (no API key needed).
- `lib/consistency.js` — the fast, non-LLM consistency check described in the roadmap.
- `lib/pipeline.js` — ties extraction → generation → consistency check together, with automatic
  live→demo fallback per call.
- `server.js` — Express server: serves the frontend and exposes `POST /api/transform`.
- `public/index.html` — the whole frontend (dashboard, workspace, results), no build step.

## Current scope (and what's next)

This prototype accepts **pasted text or a plain `.txt` file** as source input, and generates
**5 formats**: slide deck, social post, public advisory, video script, infographic.

Natural next steps, in priority order for a hackathon judge demo:
1. PDF/image ingestion (the `pdf` and OCR objectives from the brief) — currently text-only.
2. A deeper, LLM-based consistency validator (today's check is a fast heuristic on numbers only).
3. Editing generated output in place before export (the brief's "preview, editing, export" objective).
4. Native export (.pptx for the slide deck, image render for the infographic) instead of copy-as-text.

## API

`GET /api/health` → `{ ok, mode: "live"|"demo", formats: [...] }`

`POST /api/transform`
- JSON body: `{ source: string, params: {audience,tone,language,detail,objective,style}, formats: string[] }`
- or `multipart/form-data` with a `file` field (plain text) and a `payload` field (the JSON string above, minus `source`)
- Returns: `{ ok, mode, factGraph, results: { [format]: { output, mode, consistency } } }`
