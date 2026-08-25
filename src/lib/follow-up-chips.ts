import type { MenuItem } from "./types";
import { findMentionedProduct } from "./find-mentioned-product";

// ponytail: no extra AI call just to generate follow-up chips — keyword-matched against the reply
// text instead, from a small curated pool. Contextual per-reply without doubling API cost per message.
const POOL = {
  confidence: "Kenapa confidence-nya segitu?",
  compareYesterday: "Bandingkan sama kemarin",
  otherProduct: "Ada produk lain yang cocok?",
  weather: "Cuacanya bakal berubah nggak besok?",
  holiday: "Ada momentum lain yang perlu disiapin?",
  general: "Ada rekomendasi lain?",
} as const;

export function pickFollowUps(replyText: string, menuItems: MenuItem[]): string[] {
  const lower = replyText.toLowerCase();
  const chips: string[] = [];

  if (/confidence|keyakinan|yakin/.test(lower)) chips.push(POOL.confidence);
  if (findMentionedProduct(replyText, menuItems)) chips.push(POOL.otherProduct);
  if (/hujan|cuaca|panas|suhu/.test(lower)) chips.push(POOL.weather);
  if (/libur|weekend|hari besar/.test(lower)) chips.push(POOL.holiday);

  for (const fallback of [POOL.compareYesterday, POOL.general]) {
    if (chips.length >= 3) break;
    if (!chips.includes(fallback)) chips.push(fallback);
  }

  return chips.slice(0, 3);
}

export const CHAT_STARTERS = ["Kenapa confidence-nya segitu?", "Produk apa yang paling cocok dipromosikan?", "Ada rekomendasi lain?"];
