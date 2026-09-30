<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SkillVerse Development Rules

These rules apply to every change in this project.

## Architecture

- Use the existing project architecture: Next.js, TypeScript, App Router, PostgreSQL, Prisma, Tailwind CSS, and shadcn/ui.
- Follow feature-based organization and prefer simple solutions over abstractions.

## Folder Structure

- Follow the existing folder structure strictly.
- Before creating a file or folder, check whether existing code can be reused.
- Create files only when required by the feature. Never create duplicate, temporary, placeholder, unnecessary, or speculative files.
- Keep related code together. Do not reorganize existing folders unless explicitly requested.

## Code Quality

- Write clean, readable, maintainable, type-safe TypeScript.
- Keep components small and focused. Reuse existing components, utilities, hooks, schemas, and services.
- Avoid duplicate code, over-engineering, unnecessary design patterns, excessive abstractions, and premature optimization.
- Use proper error handling and validation. Never ignore TypeScript or ESLint errors.
- Do not use `any` unless absolutely unavoidable.
- Keep server/client boundaries correct and never expose secrets or sensitive data.

## Feature Development

Before coding:

1. Understand the existing structure.
2. Find reusable code.
3. Identify affected files.
4. Make the smallest clean change.

Do not modify unrelated files.

After coding:

- Check imports and types.
- Check for duplicate logic.
- Run relevant lint and type checks, and fix errors before finishing.

## Database and API

- Use Prisma for database access and follow existing schema conventions.
- Do not duplicate models or fields. Never modify or delete existing data structures without checking dependencies.
- Validate input with existing Zod schemas.
- Follow existing API conventions and return consistent responses and errors.
- Check authentication and authorization where required.

## UI and AI

- Reuse existing UI components and follow the existing design system.
- Keep UI simple and responsive. Do not introduce new libraries when existing dependencies can solve the problem.
- Keep AI integration isolated and reusable. Never hardcode API keys.
- Validate AI responses before using them, and do not add AI where normal application logic is sufficient.

## Core Rule

Simple. Reusable. Type-safe. Feature-focused. No unnecessary files, code, or dependencies. Preserve the existing architecture. When uncertain, inspect the codebase first instead of guessing.
