# Synchronicity Protocol Landing Page

## Overview
A landing page for the Synchronicity protocol — a system that turns shared discoveries into mintable, on-chain cryptographic proof using sealed envelopes, action commits, and EAS attestations.

## Architecture
- **Frontend**: React + Vite + Tailwind v4 + Framer Motion
- **Backend**: Express.js with PostgreSQL via Drizzle ORM
- **Auth**: Privy (lazy-loaded, activated via `VITE_PRIVY_APP_ID` env var)
- **Routing**: wouter (frontend), Express (API)

## Key Features
- Dark cryptographic aesthetic with glassmorphism and neon accents
- Protocol flow visualization (5-step ActionCommit -> Mint pipeline)
- Waitlist signup with email validation and duplicate detection
- Live synchronicity events feed (recently resolved)
- Privy wallet auth integration (lazy-loaded, $1.00 gas credit UX)
- Live waitlist counter

## Data Model
- `waitlist_entries`: id (serial), email (unique), created_at (timestamp)
- `synchronicity_events`: id (serial), participantA, participantB, objectType, objectTitle, objectId, evidenceClass, deltaSeconds, score, resolvedAt
- `users`: id (uuid), username, password (boilerplate, not actively used)

## API Routes
- `POST /api/waitlist` — Add email to waitlist
- `GET /api/waitlist/count` — Get current waitlist count
- `GET /api/sync-events` — Get recent synchronicity events
- `POST /api/sync-events` — Create a synchronicity event

## File Structure
- `client/src/pages/Home.tsx` — Main landing page with hero, protocol flow, sync feed, waitlist
- `client/src/lib/privy.tsx` — Privy auth provider (lazy-loaded via dynamic import)
- `client/src/App.tsx` — App root with AuthProvider wrapper
- `shared/schema.ts` — Drizzle schema definitions
- `server/routes.ts` — API endpoints
- `server/storage.ts` — Database storage interface
- `server/db.ts` — Drizzle/pg pool setup

## Design System
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code)
- Colors: Dark background with blue/purple gradients, green code blocks
- Custom CSS classes: `.glass-panel`, `.code-block`, `.neon-text`

## Privy Setup
To activate Privy auth, set the `VITE_PRIVY_APP_ID` environment variable to your Privy App ID from console.privy.io. Without it, the app gracefully falls back to waitlist-only mode. Gas credit ($1.00) is displayed in the UI when authenticated.