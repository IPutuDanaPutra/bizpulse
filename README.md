# BizPulse

**Know what's happening. Act ahead.**

A dashboard for Indonesian UMKM (micro/small business) owners that pulls today's weather and upcoming public holidays automatically, then has AI synthesize both — plus the owner's business profile and product catalog — into one actionable daily recommendation.

## Information architecture

- **Dashboard** — the radar-ring hero (today at center, each ring outward a further day, ring style encoding forecast confidence) + the streamed AI insight.
- **Profil** — business category, location (address search), area type, weather exposure, delivery status, category-specific fields.
- **Menu & Produk** — upload a menu photo, PDF, or spreadsheet; the extracted product list feeds the AI so recommendations name specific products.
- **Settings** — DeepSeek API key (bring-your-own-key, stored in `localStorage`, never sent anywhere but the DeepSeek call itself).

## How it works

1. On page load, weather ([Open-Meteo](https://open-meteo.com)) and public holiday ([Nager.Date](https://date.nager.at)) data fetch in parallel — both are free, keyless, and unlimited at this scale.
2. Once both resolve, the combined data + business profile + product list is streamed to DeepSeek (`deepseek-v4-flash`) via the Vercel AI SDK, appearing token-by-token in the insight card.
3. The finished response is cached per day (per date + location + business category) in `localStorage`.

## Tech stack

- Next.js (App Router)
- shadcn/ui (Base UI primitives, neutral base) + Tailwind CSS
- lucide-react, next-themes (light/dark)
- Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) for streaming DeepSeek calls
- react-hook-form + zod for the profile form, react-dropzone + xlsx + pdf-parse for menu ingestion

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), fill in your Profil, then add your own DeepSeek API key under Settings — the app has no server-side key, everyone brings their own.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | Default country code for holiday lookups (`ID`) |
