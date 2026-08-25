import type { MenuItem } from "./types";

// The only "citation" BizPulse shows (v5 §3): never a provider name, only the user's own product,
// when AI-generated text actually names it.
export function findMentionedProduct(text: string, menuItems: MenuItem[]): MenuItem | null {
  const lower = text.toLowerCase();
  return menuItems.find((item) => item.name.length > 1 && lower.includes(item.name.toLowerCase())) ?? null;
}
