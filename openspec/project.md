# Project Context

## Purpose
USSP monorepo containing the public website (ussp.co), back-office ATS (app.ussp.co), AI transformation tools (tools.ussp.co), and shared platform packages. OpenSpecMatch is a new standalone matching engine package being built inside this monorepo.

## Tech Stack
- TypeScript, Next.js 16 (App Router), React 19
- Tailwind CSS v4
- Supabase (PostgreSQL)
- Vitest v2 (Windows compatibility)
- Alembic (Python) for DB migrations
- LLM integration: Anthropic SDK + OpenAI SDK

## Project Conventions

### Code Style
- TypeScript strict mode
- ESM modules
- Tailwind for styling, no CSS modules
- Font variables: `--font-alata` (headings), `--font-montserrat` (body), `--font-spartan` (display)

### Architecture Patterns
- Monorepo: `packages/` for shared modules, `src/` for public site
- Multi-tenant: all data filtered by `site_id`
- Platform-core: shared backend queries, auth, types
- Strategy pattern for pluggable scoring engines

### Testing Strategy
- Vitest v2 for unit and integration tests
- Fixture-based regression tests for matching
- >80% line coverage target for new packages
- msw for mocking LLM API calls

### Git Workflow
- Main branch: `main`
- Feature branches for changes
- Co-authored commits with AI assistant

## Domain Context
- USSP is an IT staffing and consulting firm (founded 2003)
- ATS (Applicant Tracking System) for managing candidate pipeline
- Healthcare staffing vertical with license/certification requirements
- Government contracts (TOPS, Illinois)
- OpenSpecMatch: domain-agnostic matching engine for resumes, RFPs, and grants

## Important Constraints
- Platform-core must NOT have its own node_modules for next/next-auth
- Root tsconfig excludes `packages/backoffice`
- Windows development environment (affects tool choices)
- Vitest v2 required (v4 has rolldown binding issues on Windows)

## External Dependencies
- Supabase: database, auth, file storage
- Railway: hosting (separate services per app)
- Anthropic API: LLM extraction and taxonomy resolution
- OpenAI API: alternative LLM provider
- InstaGrants (`D:\Code\InstaGrants`): prior research for grant matching (untested code, reference only)
