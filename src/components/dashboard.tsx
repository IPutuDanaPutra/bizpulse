"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWeather } from "@/lib/weather";
import { fetchNextHolidays } from "@/lib/holidays";
import { getApiKey, getMenuItems } from "@/lib/local-store";
import type { BusinessProfile, HolidayEntry, MenuItem, WeatherDay } from "@/lib/types";
import { BUSINESS_CATEGORY_LABELS } from "@/lib/types";
import { RadarRings } from "@/components/radar-rings";
import { InsightCard } from "@/components/insight-card";
import { HolidayCard, HolidayCardSkeleton } from "@/components/holiday-card";
import { OutlookStrip } from "@/components/outlook-strip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Pencil } from "lucide-react";

export function Dashboard({ profile }: { profile: BusinessProfile }) {
  const [weather, setWeather] = useState<WeatherDay[] | null>(null);
  const [holidays, setHolidays] = useState<HolidayEntry[] | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyLoaded, setKeyLoaded] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount
    setApiKey(getApiKey());
    setKeyLoaded(true);
    setMenuItems(getMenuItems());
    let cancelled = false;
    fetchWeather(profile.location.lat, profile.location.lon).then((d) => !cancelled && setWeather(d));
    fetchNextHolidays().then((d) => !cancelled && setHolidays(d));
    return () => {
      cancelled = true;
    };
  }, [profile.location.lat, profile.location.lon]);

  const nextHoliday = holidays?.[0] ?? null;
  const today = weather?.[0] ?? null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {profile.location.label.split(",")[0]} · {BUSINESS_CATEGORY_LABELS[profile.category]}
        </div>
        <Button render={<Link href="/profile" />} variant="ghost" size="sm">
          <Pencil className="size-4" /> Edit profil
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="stagger-in" style={{ animationDelay: "0ms" }}>
          {weather ? (
            <RadarRings days={weather} holiday={nextHoliday} aiActive={!!apiKey} />
          ) : (
            <Skeleton className="mx-auto aspect-square w-full max-w-[320px] rounded-full" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="stagger-in" style={{ animationDelay: "120ms" }}>
            {holidays ? <HolidayCard holiday={nextHoliday} /> : <HolidayCardSkeleton />}
          </div>
          <div className="stagger-in" style={{ animationDelay: "240ms" }}>
            {today && keyLoaded ? (
              <InsightCard apiKey={apiKey} profile={profile} today={today} holiday={nextHoliday} menuItems={menuItems} />
            ) : (
              <Skeleton className="h-32 w-full" />
            )}
          </div>
        </div>
      </div>

      {weather && (
        <div className="stagger-in" style={{ animationDelay: "320ms" }}>
          <OutlookStrip days={weather} />
        </div>
      )}
    </div>
  );
}
