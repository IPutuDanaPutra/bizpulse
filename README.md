# BizPulse

**Know what's happening. Act ahead.**

A dashboard for Indonesian UMKM (micro/small business) owners that pulls today's weather and upcoming public holidays automatically, then has AI synthesize both into one actionable daily recommendation — no manual searching, no cross-referencing multiple apps.

## Problem

UMKM owners make daily operational decisions (stock, staffing, promo timing) based on gut feeling, not external signals. They don't systematically check weather forecasts or upcoming holidays before deciding what to prepare.

## How it works

1. On page load, weather ([Open-Meteo](https://open-meteo.com)) and public holiday ([Nager.Date](https://date.nager.at)) data fetch in parallel — both are free, keyless, and unlimited at this scale, so there's no manual "search" button.
2. Once both resolve, the combined data + business category is sent to DeepSeek (`deepseek-v4-flash`) to generate one grounded, concrete recommendation.
3. The AI response is cached per day (per date + location + business category) in `localStorage`, so reopening the app the same day doesn't regenerate it.

## Tech stack

- Next.js (App Router)
- shadcn/ui (neutral base) + Tailwind CSS
- lucide-react
- DeepSeek API via the OpenAI-compatible SDK

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in DEEPSEEK_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API key, used server-side only |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | Default country code for holiday lookups (`ID`) |
