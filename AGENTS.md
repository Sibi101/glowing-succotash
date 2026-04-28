# AGENTS.md

## Project Context
- This repository is a **personal Perplexity-style AI search website**.
- Primary stack: **Next.js App Router + TypeScript**.
- Styling: **Tailwind CSS**.

## Architecture & Code Guidelines
- Prefer **small, reusable components** over large monolithic ones.
- Keep frontend components **clean, aesthetic, and easy to maintain**.
- Avoid adding unnecessary dependencies; favor built-in platform/framework features first.
- Use mock data unless a task **explicitly** asks for real API integration.

## Security & API Key Rules
- Keep API keys **server-side only**.
- Never expose secrets in client-side code, including:
  - `TAVILY_API_KEY`
  - `DEEPSEEK_API_KEY`
- Do not hardcode credentials in source files, commits, or examples beyond empty placeholders.

## Implementation Expectations for Codex Tasks
- Follow Next.js App Router conventions and maintain strong TypeScript typing.
- Keep changes focused and minimal for the requested task.
- Update docs when behavior or setup changes.

## Required Checks Before Finishing
- Run lint and typecheck before concluding work:
  - `npm run lint`
  - `npm run typecheck`
