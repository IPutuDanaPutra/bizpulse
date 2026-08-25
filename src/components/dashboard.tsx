"use client";

import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weather";
import { fetchNextHolidays } from "@/lib/holidays";
import { getOrFetchInsight } from "@/lib/insight-cache";
import type { BusinessContext, DailyInsight, HolidayEntry, WeatherDay } from "@/lib/types";
import { WeatherCard, WeatherCardSkeleton } from "./weather-card";
import { HolidayCard, HolidayCardSkeleton } from "./holiday-card";
import { InsightCard, InsightCardSkeleton } from "./insight-card";
import { ForecastTabs } from "./forecast-tabs";
import { SaveSheet } from "./save-sheet";
import { Button } from "@/components/ui/button";
import { BUSINESS_CATEGORY_LABELS } from "@/lib/types";
import { MapPin, RotateCcw } from "lucide-react";

export function Dashboard({ ctx, onReset }: { ctx: BusinessContext; onReset: () => void }) {
  const [weather, setWeather] = useState<WeatherDay[] | null>(null);
  const [holidays, setHolidays] = useState<HolidayEntry[] | null>(null);
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [insightError, setInsightError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    fetchWeather(ctx.location.lat, ctx.location.lon).then((d) => !cancelled && setWeather(d));
    fetchNextHolidays().then((d) => !cancelled && setHolidays(d));
    return () => {
      cancelled = true;
    };
  }, [ctx.location.lat, ctx.location.lon]);

  const nextHoliday = holidays?.[0] ?? null;
  const today = weather?.[0] ?? null;

  useEffect(() => {
    if (!today || holidays === null) return;
    let cancelled = false;
    getOrFetchInsight(ctx, today, nextHoliday)
      .then((r) => !cancelled && setInsight(r))
      .catch(() => !cancelled && setInsightError("Tidak bisa memuat rekomendasi AI saat ini."));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today?.date, nextHoliday?.date]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {ctx.location.label} · {BUSINESS_CATEGORY_LABELS[ctx.category]}
        </div>
        <div className="flex items-center gap-2">
          <SaveSheet insight={insight} />
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="size-4" /> Ganti
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="stagger-in" style={{ animationDelay: "0ms" }}>
          {today ? <WeatherCard today={today} /> : <WeatherCardSkeleton />}
        </div>
        <div className="stagger-in" style={{ animationDelay: "120ms" }}>
          {holidays ? <HolidayCard holiday={nextHoliday} /> : <HolidayCardSkeleton />}
        </div>
      </div>

      <div className="stagger-in" style={{ animationDelay: "240ms" }}>
        {insight || insightError ? (
          <InsightCard insight={insight} error={insightError} />
        ) : (
          <InsightCardSkeleton />
        )}
      </div>

      {weather && (
        <div className="stagger-in" style={{ animationDelay: "320ms" }}>
          <ForecastTabs days={weather} />
        </div>
      )}
    </div>
  );
}
