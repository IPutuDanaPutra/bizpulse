import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import type { BusinessProfile, HolidayEntry, MenuItem, WeatherDay } from "@/lib/types";

function buildSystemPrompt(
  weather: WeatherDay,
  holiday: HolidayEntry | null,
  profile: BusinessProfile,
  menuItems: MenuItem[]
) {
  return `You are BizPulse's assistant, chatting with an Indonesian UMKM (micro/small business) owner about today's recommendation.
Write in Bahasa Indonesia, casual-professional tone. Keep replies short (2-4 sentences unless asked for more detail).
Ground answers in the data below — don't make up numbers.

Nama usaha: ${profile.businessName} (${profile.category})
Lokasi: ${profile.location.label}

Cuaca hari ini: peluang hujan ${weather.precipitationProbability}%, curah hujan ${weather.precipitationSum}mm, suhu ${weather.tempMin}-${weather.tempMax}°C, angin ${weather.windSpeedMax} km/h.
Hari besar terdekat: ${holiday ? `${holiday.localName}, ${holiday.daysUntil} hari lagi` : "tidak ada dalam waktu dekat"}.
${menuItems.length > 0 ? `Produk: ${menuItems.map((m) => m.name).join(", ")}.` : "Belum ada produk yang ditambahkan."}`;
}

export async function POST(req: Request) {
  const { messages, apiKey, weather, holiday, profile, menuItems } = (await req.json()) as {
    messages: UIMessage[];
    apiKey: string;
    weather: WeatherDay;
    holiday: HolidayEntry | null;
    profile: BusinessProfile;
    menuItems: MenuItem[];
  };

  if (!apiKey) {
    return new Response("AI API key belum diisi.", { status: 400 });
  }

  const deepseek = createOpenAI({ apiKey, baseURL: "https://api.deepseek.com" });

  const result = streamText({
    model: deepseek("deepseek-v4-flash"),
    system: buildSystemPrompt(weather, holiday, profile, menuItems),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
