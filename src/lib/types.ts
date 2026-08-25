export type ConfidenceTier = "actionable" | "indicative" | "outlook";

export interface WeatherDay {
  date: string; // ISO date
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number; // %
  precipitationSum: number; // mm
  windSpeedMax: number;
  uvIndexMax: number;
  confidenceTier: ConfidenceTier;
}

export interface HolidayEntry {
  date: string;
  localName: string;
  name: string;
  isLongWeekend: boolean;
  longWeekendDays?: number;
  daysUntil: number;
}

export type BusinessCategory =
  | "fnb_outdoor"
  | "fnb_delivery"
  | "retail"
  | "jasa"
  | "other";

export interface BusinessContext {
  category: BusinessCategory;
  location: { lat: number; lon: number; label: string };
}

export interface DailyInsight {
  date: string;
  headline: string;
  recommendation: string;
  generatedAt: string;
}

export const BUSINESS_CATEGORY_LABELS: Record<BusinessCategory, string> = {
  fnb_outdoor: "F&B (lapak/outdoor)",
  fnb_delivery: "F&B (delivery/dine-in)",
  retail: "Retail/Toko",
  jasa: "Jasa",
  other: "Lainnya",
};
