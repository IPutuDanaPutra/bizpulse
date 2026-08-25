"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Store, MapPin } from "lucide-react";
import { CITIES } from "@/lib/cities";
import { BUSINESS_CATEGORY_LABELS, type BusinessCategory, type BusinessContext } from "@/lib/types";

export function Onboarding({ onDone }: { onDone: (ctx: BusinessContext) => void }) {
  const [category, setCategory] = useState<BusinessCategory | null>(null);
  const [cityLabel, setCityLabel] = useState<string>(CITIES[0].label);

  const canSubmit = category !== null;

  function submit() {
    if (!category) return;
    const city = CITIES.find((c) => c.label === cityLabel) ?? CITIES[0];
    onDone({ category, location: { lat: city.lat, lon: city.lon, label: city.label } });
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="size-5" /> Radar Usaha
          </CardTitle>
          <CardDescription>
            Ceritakan sedikit tentang usahamu supaya rekomendasi harian lebih relevan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Kategori usaha</span>
            <ToggleGroup
              variant="outline"
              value={category ? [category] : []}
              onValueChange={(v) => v[0] && setCategory(v[0] as BusinessCategory)}
              className="flex-wrap justify-start"
            >
              {Object.entries(BUSINESS_CATEGORY_LABELS).map(([value, label]) => (
                <ToggleGroupItem key={value} value={value} className="px-3">
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <MapPin className="size-4" /> Lokasi
            </span>
            <Select value={cityLabel} onValueChange={(v) => v && setCityLabel(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c.label} value={c.label}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button disabled={!canSubmit} onClick={submit}>
            Mulai
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
