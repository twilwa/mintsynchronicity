# Synchronicity Protocol Landing Page

## Overview
A landing page for the Synchronicity protocol — a system that turns shared discoveries into mintable, on-chain cryptographic proof using sealed envelopes, action commits, and EAS attestations.

## Architecture
- **Frontend**: React + Vite + Tailwind v4 + Framer Motion
- **Backend**: Express.js with PostgreSQL via Drizzle ORM
- **Routing**: wouter (frontend), Express (API)

## Key Features
- Dark cryptographic aesthetic with glassmorphism and neon accents
- Protocol flow visualization (5-step ActionCommit → Mint pipeline)
- Waitlist signup with email validation and duplicate detection
- Live waitlist counter

## Data Model
- `waitlist_entries`: id (serial), email (unique), created_at (timestamp)
- `users`: id (uuid), username, password (boilerplate, not actively used)

## API Routes
- `POST /api/waitlist` — Add email to waitlist
- `GET /api/waitlist/count` — Get current waitlist count

## File Structure
- `client/src/pages/Home.tsx` — Main landing page component
- `shared/schema.ts` — Drizzle schema definitions
- `server/routes.ts` — API endpoints
- `server/storage.ts` — Database storage interface
- `server/db.ts` — Drizzle/pg pool setup

## Design System
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code)
- Colors: Dark background with blue/purple gradients, green code blocks
- Custom CSS classes: `.glass-panel`, `.code-block`, `.neon-text`