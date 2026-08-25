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

export type AreaType =
  | "jalan_utama"
  | "dalam_gang"
  | "mall"
  | "perumahan"
  | "wisata";

export type Exposure = "indoor" | "outdoor" | "both";

export type DeliveryStatus = "none" | "own" | "platform";

export interface BusinessProfile {
  category: BusinessCategory;
  location: { lat: number; lon: number; label: string };
  areaType: AreaType;
  exposure: Exposure;
  deliveryStatus: DeliveryStatus;
  // adaptive, category-specific fields — all optional since they only apply to some categories
  operatingHours?: string; // fnb / jasa
  hasOutdoorSeating?: boolean; // fnb
  isPerishable?: boolean; // retail
  isOnLocationService?: boolean; // jasa
}

/** @deprecated kept for the v1 localStorage shape; BusinessProfile supersedes it. */
export interface BusinessContext {
  category: BusinessCategory;
  location: { lat: number; lon: number; label: string };
}

export interface DailyInsight {
  date: string;
  text: string; // streamed 1-2 sentence recommendation
  generatedAt: string;
}

export type MenuItemSource = "image" | "pdf" | "spreadsheet" | "manual";

export interface MenuItem {
  id: string;
  name: string;
  category?: string;
  price?: number;
  weatherSensitive?: boolean;
  source: MenuItemSource;
  addedAt: string;
}

export const BUSINESS_CATEGORY_LABELS: Record<BusinessCategory, string> = {
  fnb_outdoor: "F&B (lapak/outdoor)",
  fnb_delivery: "F&B (delivery/dine-in)",
  retail: "Retail/Toko",
  jasa: "Jasa",
  other: "Lainnya",
};

export const AREA_TYPE_LABELS: Record<AreaType, string> = {
  jalan_utama: "Jalan utama",
  dalam_gang: "Dalam gang",
  mall: "Mall & pusat perbelanjaan",
  perumahan: "Perumahan",
  wisata: "Area wisata",
};

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  none: "Belum menerima delivery",
  own: "Delivery sendiri",
  platform: "Pakai platform (GoFood/GrabFood/ShopeeFood)",
};

export const EXPOSURE_LABELS: Record<Exposure, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  both: "Keduanya",
};
