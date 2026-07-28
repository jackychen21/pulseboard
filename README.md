# PulseBoard

PulseBoard is a polished Kanban-style task board built for the internship assessment. It supports:

- Guest sessions through Supabase anonymous auth
- Drag-and-drop status updates
- Search and filtering
- Due date urgency indicators
- Summary stats
- Demo fallback mode when Supabase environment variables are not configured

## Stack

- React 19
- TypeScript
- Vite
- Supabase

## Run locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

3. Add your Supabase project values to `.env`:

   ```bash
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

4. Start the app:

   ```bash
   pnpm dev
   ```

If you skip step 3, the app starts in demo mode and persists sample tasks to `localStorage`.

## Supabase setup

1. Create a new Supabase project.
2. Enable anonymous sign-ins in `Authentication > Providers > Anonymous`.
3. Run the SQL in [supabase/schema.sql](/Users/jackychen/Documents/Codex/2026-07-28/1-j/supabase/schema.sql).
4. Add the public `Project URL` and `anon` key to `.env`.

## Assessment mapping

- Required board: implemented with four default columns
- Required persistence: Supabase-ready `tasks` table with RLS
- Guest accounts: anonymous auth and per-user access isolation
- Frontend states: loading, empty, and error states included
- Advanced features implemented:
  - Search and filtering
  - Due date indicators
  - Board summary stats

## Deployment

This app can be deployed to Vercel, Netlify, or Cloudflare Pages as a static Vite app. Set the same two environment variables in the host dashboard.

