import type { BusinessContext, DailyInsight, HolidayEntry, WeatherDay } from "./types";

function cacheKey(ctx: BusinessContext, date: string) {
  return `radar-usaha:insight:${date}:${ctx.location.lat.toFixed(2)},${ctx.location.lon.toFixed(2)}:${ctx.category}`;
}

export function getCachedInsight(ctx: BusinessContext, date: string): DailyInsight | null {
  try {
    const raw = localStorage.getItem(cacheKey(ctx, date));
    return raw ? (JSON.parse(raw) as DailyInsight) : null;
  } catch {
    return null;
  }
}

export async function getOrFetchInsight(
  ctx: BusinessContext,
  today: WeatherDay,
  holiday: HolidayEntry | null
): Promise<DailyInsight> {
  const cached = getCachedInsight(ctx, today.date);
  if (cached) return cached;

  const res = await fetch("/api/insight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weather: today, holiday, category: ctx.category }),
  });
  if (!res.ok) throw new Error("Gagal membuat insight AI");
  const insight = (await res.json()) as DailyInsight;

  try {
    localStorage.setItem(cacheKey(ctx, today.date), JSON.stringify(insight));
  } catch {
    // ponytail: localStorage can throw (private mode, quota) — insight still renders, just not cached
  }
  return insight;
}
