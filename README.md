# Aether Search (Perplexity-Style AI Search)

A premium AI search app built with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Framer Motion
- Lucide React

The app uses:

- **Tavily** for real-time web/news retrieval
- **DeepSeek V4 Flash** for answer synthesis from retrieved sources

## 1) Local Setup

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

## 2) Environment Variables

Required for runtime API calls:

- `TAVILY_API_KEY` – used only on the server in `lib/tavily.ts`
- `DEEPSEEK_API_KEY` – used only on the server in `lib/deepseek.ts`

Security notes:

- Do **not** prefix these with `NEXT_PUBLIC_`.
- Do **not** reference these keys in client components.
- The frontend calls only `/api/ask`; provider calls happen server-side.

## 3) Development Commands

```bash
npm run dev        # start development server
npm run build      # production build
npm run start      # run production build
npm run lint       # lint checks
npm run typecheck  # TypeScript checks
```

Recommended before committing:

```bash
npm run lint && npm run typecheck && npm run build
```

## 4) Deployment (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. In **Project Settings → Environment Variables**, add:
   - `TAVILY_API_KEY`
   - `DEEPSEEK_API_KEY`
4. Deploy.

Vercel defaults for Next.js are sufficient (build command `npm run build`, output `.next`).

### Post-deploy sanity checks

- Load homepage successfully.
- Submit a query and verify `/api/ask` returns:
  - `answer`
  - `sources`
  - `followUps`
- Confirm no provider secrets appear in browser devtools/network payloads.

## 5) Production Safety

- `/api/ask` validates input and returns 400 for bad requests.
- Provider failures return a clean 500 response.
- Detailed provider error internals are not exposed in production responses.

## Project Structure

```text
app/
  api/ask/route.ts
components/
lib/
types/
```
