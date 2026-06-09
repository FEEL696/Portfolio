# FEEL Create&Dev Portfolio

An interactive portfolio website for FEEL Create&Dev, built around fullscreen motion, horizontal project browsing, detailed project modals, and a lightweight CMS for managing portfolio cases.

The project is designed as a visual showcase first: project media, motion timing, scroll behavior, and modal presentation are treated as core parts of the experience rather than decorative additions.

## How It Works

The public website renders a curated set of portfolio projects and services. Project content is loaded from Supabase when configured, with a local fallback in the codebase so the site can still render if the remote source is unavailable.

The admin area is available at `/admin`. It allows authenticated editing of project data:

- project title and description
- cover image URL
- project URL
- stack metadata
- gallery media URLs
- project order
- media order

Images and videos are not uploaded into this repository. They are referenced by external URLs and rendered directly in the portfolio UI.

## Tech Stack

- React
- TypeScript
- Vite
- Framer Motion
- Tailwind CDN utilities
- Supabase Auth
- Supabase Postgres
- Vercel-ready static build

## Project Structure

- `src/main.tsx` is the Vite and React entry point.
- `src/App.tsx` owns the loader, intro transition, and root UI state.
- `src/components/` contains the public portfolio interface.
- `src/components/shared/` contains reusable animated UI primitives.
- `src/admin/` contains the project CMS interface.
- `src/content/` contains local fallback content and the portfolio content store.
- `src/lib/` contains Supabase setup and UI helpers.
- `src/types/` contains portfolio domain types.
- `src/styles/` contains global styles.
- `supabase/` contains SQL setup files for the projects table and seed data.

## Content Source

Project data follows this shape:

- `id`
- `title`
- `description`
- `stack`
- `image`
- `href`
- `galleryImages`

The same structure is used by the local fallback content, the Supabase table, and the admin UI.

## Deployment Notes

The app builds to a static `dist` directory and is ready for Vercel deployment.

Required environment variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Supabase setup files:

- `supabase/projects-schema.sql`
- `supabase/projects-seed.sql`

The local `.env.local` file is intentionally excluded from git.
