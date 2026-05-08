# Aether Search (Perplexity-Style AI Search)

A Perplexity-style AI search app built with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

The app uses:

- **Tavily** for real-time web/news retrieval
- **DeepSeek V4 Flash** for answer synthesis from retrieved sources

## Project Overview

Aether Search accepts a user query, retrieves fresh web/news context with Tavily, and synthesizes a cited answer using DeepSeek V4 Flash. The frontend communicates only with the internal API route (`/api/ask`), while provider keys remain server-side.

## Current Product Shape

- Single streamlined search flow (no mode switching).
- Staged loading UI (`Searching` → `Reading` → `Generating`).
- Inline citations mapped to rendered source cards.
- Follow-up question chips for quick iteration.
- Gradient-based premium UI theme with serif typography.

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Fill in required values in `.env.local`:

- `TAVILY_API_KEY`
- `DEEPSEEK_API_KEY`

> No database is currently used, so there are no required database environment variables at this time.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If you see an outdated Next.js overlay/runtime cache issue during development, clear the build cache and restart:

```bash
rm -rf .next
npm run dev
```

## Environment Variables

Required for runtime API calls:

- `TAVILY_API_KEY` – used only on the server in `lib/tavily.ts`
- `DEEPSEEK_API_KEY` – used only on the server in `lib/deepseek.ts`

Security notes:

- Do **not** prefix these with `NEXT_PUBLIC_`.
- Do **not** reference these keys in client components.
- The frontend calls only `/api/ask`; provider calls happen server-side.

## Development Commands

```bash
npm run dev        # start development server
npm run build      # production build
npm run start      # run production build
npm run lint       # lint checks
npm run typecheck  # TypeScript checks
```

Recommended before deploying:

```bash
npm run lint && npm run typecheck && npm run build
```

## Deployment (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. In **Project Settings → Environment Variables**, add:
   - `TAVILY_API_KEY`
   - `DEEPSEEK_API_KEY`
4. Deploy.

Vercel defaults for Next.js are sufficient (build command `npm run build`, output `.next`).

### Post-deploy checks

- Load homepage successfully.
- Submit a query and verify `/api/ask` returns:
  - `answer`
  - `sources`
  - `followUps`
- Confirm no provider secrets appear in browser devtools/network payloads.

## Production Readiness Notes

- `/api/ask` validates input and returns 400 for bad requests.
- `/api/ask` returns 415 for non-JSON content-type requests.
- Provider failures return a clean 500 response.
- Detailed provider error internals are not exposed in production responses.

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  api/ask/route.ts
components/
lib/
types/
```
