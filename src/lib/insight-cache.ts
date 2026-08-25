import type { BusinessProfile, Recommendation } from "./types";

// "v2" namespace: v4's Recommendation shape is structured (not plain text) — bumping the key keeps
// any old cached plain-text insight from v2/v3 from being misread as a Recommendation object.
function cacheKey(profile: BusinessProfile, date: string) {
  return `radar-usaha:recommendation:v2:${date}:${profile.location.lat.toFixed(2)},${profile.location.lon.toFixed(2)}:${profile.category}`;
}

export function getCachedRecommendation(profile: BusinessProfile, date: string): Recommendation | null {
  try {
    const raw = localStorage.getItem(cacheKey(profile, date));
    return raw ? (JSON.parse(raw) as Recommendation) : null;
  } catch {
    return null;
  }
}

export function setCachedRecommendation(profile: BusinessProfile, recommendation: Recommendation) {
  try {
    localStorage.setItem(cacheKey(profile, recommendation.date), JSON.stringify(recommendation));
  } catch {
    // ponytail: localStorage can throw (private mode, quota) — recommendation still renders, just not cached
  }
}
