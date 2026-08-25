import type { ConfidenceTier, WeatherDay } from "./types";

// WMO weather code -> short label + Lucide icon name (subset covering Open-Meteo's daily codes).
export const WMO_CODE: Record<number, { label: string; icon: "Sun" | "CloudSun" | "Cloud" | "CloudFog" | "CloudDrizzle" | "CloudRain" | "CloudSnow" | "CloudLightning" }> = {
  0: { label: "Cerah", icon: "Sun" },
  1: { label: "Cerah berawan", icon: "CloudSun" },
  2: { label: "Berawan sebagian", icon: "CloudSun" },
  3: { label: "Berawan", icon: "Cloud" },
  45: { label: "Berkabut", icon: "CloudFog" },
  48: { label: "Kabut es", icon: "CloudFog" },
  51: { label: "Gerimis ringan", icon: "CloudDrizzle" },
  53: { label: "Gerimis", icon: "CloudDrizzle" },
  55: { label: "Gerimis lebat", icon: "CloudDrizzle" },
  61: { label: "Hujan ringan", icon: "CloudRain" },
  63: { label: "Hujan", icon: "CloudRain" },
  65: { label: "Hujan lebat", icon: "CloudRain" },
  71: { label: "Salju ringan", icon: "CloudSnow" },
  73: { label: "Salju", icon: "CloudSnow" },
  75: { label: "Salju lebat", icon: "CloudSnow" },
  80: { label: "Hujan sesaat", icon: "CloudRain" },
  81: { label: "Hujan sesaat lebat", icon: "CloudRain" },
  82: { label: "Hujan sesaat sangat lebat", icon: "CloudRain" },
  95: { label: "Badai petir", icon: "CloudLightning" },
  96: { label: "Badai petir + hujan es", icon: "CloudLightning" },
  99: { label: "Badai petir hebat", icon: "CloudLightning" },
};

function confidenceTier(dayOffset: number): ConfidenceTier {
  if (dayOffset <= 3) return "actionable";
  if (dayOffset <= 7) return "indicative";
  return "outlook";
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherDay[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "daily",
    "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,uv_index_max"
  );
  url.searchParams.set("timezone", "Asia/Jakarta");
  url.searchParams.set("forecast_days", "16");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data = await res.json();
  const d = data.daily;

  return (d.time as string[]).map((date, i) => ({
    date,
    weatherCode: d.weathercode[i],
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    precipitationProbability: d.precipitation_probability_max[i],
    precipitationSum: d.precipitation_sum[i],
    windSpeedMax: d.windspeed_10m_max[i],
    uvIndexMax: d.uv_index_max[i],
    confidenceTier: confidenceTier(i),
  }));
}
