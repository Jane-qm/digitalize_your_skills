# AGENTS.md

## Cursor Cloud specific instructions

This repository is a Next.js demo app (`app` router, TypeScript) for skill exchange + agent chat.

### Install dependencies

- `npm install`

### Run locally

- `npm run dev`
- Open `http://localhost:3000`

### Checks

- Type check: `npm run typecheck`
- Build: `npm run build`

### Environment requirements

- Node.js 20+ recommended.
- To use online DeepSeek models, create `.env.local` and set `DEEPSEEK_API_KEY`.
- Optional override: `DEEPSEEK_BASE_URL` (defaults to `https://api.deepseek.com/chat/completions`).
