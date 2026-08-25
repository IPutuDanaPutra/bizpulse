export interface GeocodeResult {
  label: string;
  lat: number;
  lon: number;
}

// Nominatim (OpenStreetMap) — free, no key, consistent with the rest of the zero-friction API strategy.
export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  if (query.trim().length < 3) return [];
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", query);
  url.searchParams.set("countrycodes", "id");
  url.searchParams.set("limit", "5");

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data: Array<{ display_name: string; lat: string; lon: string }> = await res.json();
  return data.map((d) => ({ label: d.display_name, lat: parseFloat(d.lat), lon: parseFloat(d.lon) }));
}
