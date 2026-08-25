// Thin localStorage wrappers for everything that's client-only, per-browser state in this prototype:
// business profile, menu/product knowledge base, and the user's own DeepSeek API key.
import type { BusinessProfile, MenuItem } from "./types";

const PROFILE_KEY = "radar-usaha:business-profile";
const MENU_KEY = "radar-usaha:menu-items";
const API_KEY_KEY = "radar-usaha:deepseek-api-key";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — value still works for this session
  }
}

export function getProfile(): BusinessProfile | null {
  return read<BusinessProfile>(PROFILE_KEY);
}
export function saveProfile(profile: BusinessProfile) {
  write(PROFILE_KEY, profile);
}
export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    // ignore
  }
}

export function getMenuItems(): MenuItem[] {
  return read<MenuItem[]>(MENU_KEY) ?? [];
}
export function saveMenuItems(items: MenuItem[]) {
  write(MENU_KEY, items);
}

// API key is stored as a plain string, never sent anywhere but the DeepSeek call itself.
export function getApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_KEY);
  } catch {
    return null;
  }
}
export function saveApiKey(key: string) {
  try {
    localStorage.setItem(API_KEY_KEY, key);
  } catch {
    // ignore
  }
}
export function clearApiKey() {
  try {
    localStorage.removeItem(API_KEY_KEY);
  } catch {
    // ignore
  }
}
export function maskApiKey(key: string): string {
  if (key.length <= 7) return "sk-••••••••";
  return `${key.slice(0, 3)}••••••••••••${key.slice(-4)}`;
}
