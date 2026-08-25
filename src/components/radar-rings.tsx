"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Wind, Droplets } from "lucide-react";
import type { HolidayEntry, WeatherDay } from "@/lib/types";
import { WMO_CODE } from "@/lib/weather";
import { useCountUp } from "@/hooks/use-count-up";

// Ring sizes (% of container), outermost first — day6 painted first (bottom), day0 last (top, center).
// This DOM order is what makes each ring's click area resolve correctly: a smaller ring painted later
// sits on top and claims its own area, leaving the larger ring's exposed edge as its clickable annulus.
const RING_SIZES = [100, 86, 72, 58, 44, 30, 16];

export function RadarRings({
  days,
  holiday,
  aiActive,
}: {
  days: WeatherDay[]; // expects at least 7 days, index 0 = today
  holiday: HolidayEntry | null;
  aiActive: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const week = days.slice(0, 7);
  const today = week[0];
  const tempMax = useCountUp(today ? Math.round(today.tempMax) : 0);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Below ~360px the ring metaphor stops reading clearly — fall back to a linear strip
          that keeps the same confidence encoding (solid vs dashed) instead of collapsing to a plain list. */}
      <div className="hidden w-full gap-2 overflow-x-auto max-[359px]:flex">
        {week.map((day, i) => (
          <button
            key={day.date}
            onClick={() => setOpenIndex(i)}
            className={`flex min-w-16 shrink-0 flex-col items-center gap-1 rounded-lg p-2 ${
              i === 0
                ? "bg-[var(--signal-blue)] text-[var(--signal-blue-foreground)]"
                : day.confidenceTier === "actionable"
                  ? "border-2 border-foreground/70"
                  : "border border-dashed border-foreground/30"
            }`}
          >
            <span className="font-mono text-sm font-medium">{Math.round(day.tempMax)}°</span>
            {holiday && holiday.daysUntil === i && (
              <span className="size-1.5 rounded-full bg-current" aria-hidden />
            )}
          </button>
        ))}
      </div>

      <div className="relative aspect-square w-full max-w-[320px] max-[359px]:hidden">
        {week
          .map((day, i) => ({ day, i }))
          .reverse()
          .map(({ day, i }) => {
            const size = RING_SIZES[i];
            const isToday = i === 0;
            const markHoliday = holiday && holiday.daysUntil === i;

            return (
              <button
                key={day.date}
                aria-label={`Lihat detail cuaca ${day.date}`}
                onClick={() => setOpenIndex(i)}
                className={`absolute inset-0 m-auto rounded-full transition-transform hover:scale-[1.02] ${
                  isToday
                    ? "bg-[var(--signal-blue)]"
                    : day.confidenceTier === "actionable"
                      ? "border-2 border-foreground/70"
                      : "border border-dashed border-foreground/30"
                } ${isToday && aiActive ? "animate-pulse" : ""}`}
                style={{ width: `${size}%`, height: `${size}%`, clipPath: "circle(50%)" }}
              >
                {isToday && (
                  <span className="flex h-full w-full flex-col items-center justify-center text-[var(--signal-blue-foreground)]">
                    <span className="font-mono text-3xl font-semibold tabular-nums">{tempMax}°</span>
                    <span className="text-[10px] opacity-90">Hari ini</span>
                  </span>
                )}
                {markHoliday && (
                  <span
                    className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--signal-blue)] ring-2 ring-background"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Cincin pekat = pasti, putus-putus = indikatif · titik biru = hari besar terdekat
      </p>

      <DayDetailDialog
        day={openIndex !== null ? week[openIndex] : null}
        onClose={() => setOpenIndex(null)}
        isHoliday={openIndex !== null && holiday?.daysUntil === openIndex ? holiday : null}
      />
    </div>
  );
}

function DayDetailDialog({
  day,
  onClose,
  isHoliday,
}: {
  day: WeatherDay | null;
  onClose: () => void;
  isHoliday: HolidayEntry | null;
}) {
  const condition = day ? (WMO_CODE[day.weatherCode] ?? { label: "-" }) : null;
  const weekday = day
    ? new Date(day.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <Dialog open={day !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{weekday}</DialogTitle>
          <DialogDescription>{condition?.label}</DialogDescription>
        </DialogHeader>
        {day && (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-3xl font-semibold">{Math.round(day.tempMax)}°</span>
              <span className="text-muted-foreground">{Math.round(day.tempMin)}° min</span>
              <Badge variant={day.confidenceTier === "actionable" ? "default" : "outline"} className="ml-auto">
                {day.confidenceTier === "actionable" ? "Pasti" : "Indikatif"}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CloudRain className="size-4" /> {day.precipitationProbability}%
              </span>
              <span className="flex items-center gap-1.5">
                <Droplets className="size-4" /> {day.precipitationSum}mm
              </span>
              <span className="flex items-center gap-1.5">
                <Wind className="size-4" /> {day.windSpeedMax} km/h
              </span>
            </div>
            {isHoliday && (
              <p className="rounded-md bg-[var(--signal-blue)]/10 p-2 text-sm text-[var(--signal-blue)]">
                {isHoliday.localName}
                {isHoliday.isLongWeekend ? ` — long weekend ${isHoliday.longWeekendDays} hari` : ""}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
