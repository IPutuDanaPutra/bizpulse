import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { BusinessCategory, HolidayEntry, WeatherDay } from "@/lib/types";

const SYSTEM_PROMPT = `You are a concise local business advisor for Indonesian UMKM (micro/small business) owners.
You will be given today's weather forecast, upcoming holiday context, and the owner's business category.

Rules:
- Write in Bahasa Indonesia, casual-professional tone (like a sharp friend, not a corporate report).
- ALWAYS reference at least one specific number from the data provided (percentage, mm, days-until) — never write a vague statement like "cuaca kurang mendukung" without a number backing it.
- Give exactly ONE concrete, actionable recommendation — not a list. Pick the single most relevant action for this business category today.
- If nothing in the data is notable (calm weather, no near holiday), say so plainly in one short sentence rather than inventing significance. Do not pad.
- Maximum 2 sentences total.
- Respond as strict JSON: {"headline": string, "recommendation": string}. headline is a short 4-8 word tag for the moment, recommendation is the actual advice.`;

function buildUserPrompt(weather: WeatherDay, holiday: HolidayEntry | null, category: BusinessCategory) {
  return `
Kategori usaha: ${category}

Cuaca hari ini:
- Peluang hujan: ${weather.precipitationProbability}%
- Perkiraan curah hujan: ${weather.precipitationSum}mm
- Angin maksimum: ${weather.windSpeedMax} km/h
- Suhu: ${weather.tempMin}°C - ${weather.tempMax}°C

Hari besar terdekat: ${
    holiday
      ? `${holiday.localName}, ${holiday.daysUntil} hari lagi${holiday.isLongWeekend ? ` (long weekend ${holiday.longWeekendDays} hari)` : ""}`
      : "Tidak ada dalam waktu dekat"
  }

Berikan satu rekomendasi aksi untuk hari ini.
`.trim();
}

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "DEEPSEEK_API_KEY not configured" }, { status: 500 });
  }

  const { weather, holiday, category } = (await req.json()) as {
    weather: WeatherDay;
    holiday: HolidayEntry | null;
    category: BusinessCategory;
  };

  const deepseek = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });

  const completion = await deepseek.chat.completions.create({
    model: "deepseek-v4-flash",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(weather, holiday, category) },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { headline: string; recommendation: string };

  return NextResponse.json({
    date: weather.date,
    headline: parsed.headline,
    recommendation: parsed.recommendation,
    generatedAt: new Date().toISOString(),
  });
}
