# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Formula Hogar Landing — a Next.js 16 marketing site and lead-capture tool for a Spanish real estate financing product. Users can calculate savings (5% vs 30% down payment), submit viability documents, and enter a ClickUp-based CRM pipeline. All content is in Spanish; the target audience is first-time homebuyers in Spain.

## Commands

- `npm run dev` — start dev server (Next.js with Turbopack)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint 9 flat config (next core-web-vitals + TypeScript)

No test framework is configured.

## Architecture

**Framework:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, Framer Motion.

**User flow:**
1. Landing page (`/`) — hero, video, reviews, benefits, FAQ
2. Calculator (`/calculadora`) — captures lead data, computes savings via `utils/calculator.ts`, stores results in sessionStorage, redirects to viability form
3. Viability form (`/formulario-viabilidad`) — pre-fills phone/employment from URL params (`?tel=&tipo=`), uploads PDF/JPEG/PNG documents to ClickUp via `/api/viability`
4. Results (`/gracias`) — reads sessionStorage, shows animated savings comparison

**API route — `/app/api/viability/route.ts`:**
- Receives multipart FormData (phone + files)
- Normalizes Spanish phone numbers (+34 handling)
- Searches ClickUp for matching task by custom phone field, falls back to scanning task names
- Validates file types via magic bytes (PDF, JPEG, PNG only; 10MB limit)
- Blocks duplicate uploads (>1 existing attachment)
- Uploads files to ClickUp task, updates status to "DOCUMENTACIÓN"
- Sends webhook notification to n8n (`form2supabase` endpoint)

**Calculator engine — `utils/calculator.ts`:**
- Spain-specific ITP tax rates per autonomous community (19 regions)
- Rental advance coefficient table (TABLA_ADELANTOS: 12–60 months)
- Optimizes rental period to minimize FormulaHogar down payment
- Age-based mortgage percentage (<30 → 10%, >=30 → 20%)

## Key Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| ClickUp API | CRM: task search, file upload, status updates | `CLICKUP_API_KEY`, `CLICKUP_LIST_ID`, `CLICKUP_PHONE_FIELD_ID` in `.env.local` |
| n8n webhook | Notification on form submit (success/error) | Hardcoded URL in API route |
| Google Tag Manager | Analytics container GTM-PT7S8BNB | In root layout |
| Google Analytics | GA4 property G-515250967 | Via `@next/third-parties` |
| Mux | Video player in explainer section | Playback ID in VideoSection component |
| Vercel | Hosting + Speed Insights | `@vercel/speed-insights` |

## Environment Variables

Required in `.env.local`:
- `CLICKUP_API_KEY` — ClickUp API token
- `CLICKUP_LIST_ID` — Target list for viability tasks
- `CLICKUP_PHONE_FIELD_ID` — Custom field UUID for phone matching

## Design Tokens

- Primary dark green: `#163C2E`
- Accent green: `#28A77D`
- Font: Geist (sans) + Geist Mono via `next/font/google`
- Icons: `lucide-react`

## Conventions

- All page components are client components (`"use client"`) for interactivity
- Forms use `react-hook-form` with inline validation
- Path alias: `@/*` maps to project root
- Phone validation expects Spanish mobile format (6xx/7xx, 9 digits)
- No testing framework — verify UI changes manually in browser
