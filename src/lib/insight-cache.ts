import type { BusinessProfile, DailyInsight } from "./types";

function cacheKey(profile: BusinessProfile, date: string) {
  return `radar-usaha:insight:${date}:${profile.location.lat.toFixed(2)},${profile.location.lon.toFixed(2)}:${profile.category}`;
}

export function getCachedInsight(profile: BusinessProfile, date: string): DailyInsight | null {
  try {
    const raw = localStorage.getItem(cacheKey(profile, date));
    return raw ? (JSON.parse(raw) as DailyInsight) : null;
  } catch {
    return null;
  }
}

export function setCachedInsight(profile: BusinessProfile, insight: DailyInsight) {
  try {
    localStorage.setItem(cacheKey(profile, insight.date), JSON.stringify(insight));
  } catch {
    // ponytail: localStorage can throw (private mode, quota) — insight still renders, just not cached
  }
}
