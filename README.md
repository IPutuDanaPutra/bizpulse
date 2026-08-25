# BizPulse

**Know what's happening. Act ahead.**

A dashboard for Indonesian UMKM (micro/small business) owners that pulls today's weather and upcoming public holidays automatically, then has AI synthesize both — plus the owner's business profile and product catalog — into one actionable daily recommendation.

## Information architecture

- **Dashboard** — a full-width day-strip to jump between forecast days + a structured Recommendation Card (headline, reasoning, confidence meter, primary action, alternatives, save) with a "Chat lebih lanjut" panel for follow-up questions, plus a context sidebar (weather, holiday, your products).
- **Profil Bisnis** — guided one-question-at-a-time setup on first visit; a full form for editing afterward (name, category, location/address search, area type, weather exposure, delivery status, category-specific fields).
- **Menu & Produk** — upload a menu photo, PDF, or spreadsheet with live per-step status; the extracted product list feeds the AI so recommendations name specific products.
- **Settings** — AI API key (bring-your-own-key, OpenAI-compatible, stored in `localStorage`, never sent anywhere but the provider call itself).
- **Tentang** — product story and privacy notes.
- Cmd/Ctrl+K opens a command palette to jump to any page.

## How it works

1. On page load, weather ([Open-Meteo](https://open-meteo.com)) and public holiday ([Nager.Date](https://date.nager.at)) data fetch in parallel — both are free, keyless, and unlimited at this scale.
2. Once both resolve, the combined data + business profile + product list is streamed as a structured object to DeepSeek (`deepseek-v4-flash`) via the Vercel AI SDK, filling in the Recommendation Card as it streams.
3. The finished response is cached per day (per date + location + business category) in `localStorage`.
4. "Chat lebih lanjut" opens a side panel with the same context already in its system prompt — no need to re-explain your business.

## Tech stack

- Next.js (App Router)
- shadcn/ui (Base UI primitives, neutral base) + Tailwind CSS
- lucide-react, next-themes (light/dark)
- Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) — `streamObject`/`useObject` for the Recommendation Card, `streamText`/`useChat` for the chat panel
- react-hook-form + zod for the profile form, react-dropzone + xlsx + pdf-parse for menu ingestion

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), fill in your Profil Bisnis, then add your own OpenAI-compatible API key (e.g. DeepSeek) under Settings — the app has no server-side key, everyone brings their own.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | Default country code for holiday lookups (`ID`) |
