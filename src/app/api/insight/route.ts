import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import type { BusinessProfile, HolidayEntry, MenuItem, WeatherDay } from "@/lib/types";
import { AREA_TYPE_LABELS, DELIVERY_STATUS_LABELS } from "@/lib/types";
import { RecommendationSchema } from "@/lib/recommendation-schema";

const SYSTEM_PROMPT = `You are a concise local business advisor for Indonesian UMKM (micro/small business) owners.
You will be given today's weather forecast, upcoming holiday context, the owner's business profile, and (if available) their product/menu list.
Produce a structured recommendation (matching the given schema) — not a paragraph.

Rules:
- Write every text field in Bahasa Indonesia, casual-professional tone (like a sharp friend, not a corporate report).
- "reasoning" must reference at least one specific number from the data provided (percentage, mm, days-until) — never a vague statement like "cuaca kurang mendukung" without a number backing it.
- "primaryAction" is ONE concrete, actionable step — not a list. Pick the single most relevant action for this business profile today.
- If the business has delivery (own or via platform), reframe rain as opportunity where relevant ("hujan deras justru waktu ramai buat delivery"), not just risk. A walk-in-only business should still be told the honest downside.
- If a product/menu list is provided, mention a specific product name in "primaryAction" or "reasoning" when relevant — don't force it if nothing fits.
- "alternatives": give 1-3 other reasonable actions, each with a confidence lower than the primary. It's fine to give zero if nothing else is reasonable.
- If nothing in the data is notable (calm weather, no near holiday), set confidenceTier to "outlook", give it a low confidenceScore, and say so plainly in "headline" — something like "Kondisi hari ini normal — nggak ada yang perlu diantisipasi khusus." Do not invent significance or pad.`;

function buildUserPrompt(
  weather: WeatherDay,
  holiday: HolidayEntry | null,
  profile: BusinessProfile,
  menuItems: MenuItem[]
) {
  const adaptive: string[] = [];
  if (profile.operatingHours) adaptive.push(`Jam operasional: ${profile.operatingHours}`);
  if (profile.hasOutdoorSeating !== undefined) adaptive.push(`Seating outdoor: ${profile.hasOutdoorSeating ? "ya" : "tidak"}`);
  if (profile.isPerishable !== undefined) adaptive.push(`Barang mudah rusak kena cuaca: ${profile.isPerishable ? "ya" : "tidak"}`);
  if (profile.isOnLocationService !== undefined) adaptive.push(`Layanan di lokasi pelanggan: ${profile.isOnLocationService ? "ya" : "tidak, di tempat sendiri"}`);

  return `
Nama usaha: ${profile.businessName}
Kategori usaha: ${profile.category}
Tipe area: ${AREA_TYPE_LABELS[profile.areaType]}
Paparan cuaca: ${profile.exposure}
Status delivery: ${DELIVERY_STATUS_LABELS[profile.deliveryStatus]}
${adaptive.join("\n")}

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

${menuItems.length > 0 ? `Produk unggulan: ${menuItems.map((m) => m.name).join(", ")}` : ""}
`.trim();
}

export async function POST(req: Request) {
  const { weather, holiday, profile, menuItems, apiKey } = (await req.json()) as {
    weather: WeatherDay;
    holiday: HolidayEntry | null;
    profile: BusinessProfile;
    menuItems: MenuItem[];
    apiKey: string;
  };

  if (!apiKey) {
    return new Response("AI API key belum diisi.", { status: 400 });
  }

  const deepseek = createOpenAI({ apiKey, baseURL: "https://api.deepseek.com" });

  const result = streamObject({
    model: deepseek("deepseek-v4-flash"),
    schema: RecommendationSchema,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(weather, holiday, profile, menuItems),
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
