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

const TIER_OPACITY = { actionable: 1, indicative: 0.55, outlook: 0.28 } as const;

// Signal intensity per day: how much rain, and how close a holiday is — the two things v1's prompt
// design treats as "worth a glance." Normalized 0-100, drives each segment's height.
function signalIntensity(day: WeatherDay, holiday: HolidayEntry | null, dayIndex: number): number {
  const rainScore = day.precipitationProbability;
  const holidayScore = holiday && holiday.daysUntil === dayIndex ? Math.max(0, 60 - holiday.daysUntil * 5) : 0;
  return Math.min(100, Math.round(rainScore * 0.7 + holidayScore));
}

export function PulseStrip({ days, holiday }: { days: WeatherDay[]; holiday: HolidayEntry | null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-28 w-full items-end gap-1 sm:gap-1.5">
        {days.map((day, i) => {
          const intensity = signalIntensity(day, holiday, i);
          const isToday = i === 0;
          const isHolidayDay = holiday && holiday.daysUntil === i;

          return (
            <button
              key={day.date}
              aria-label={`Lihat detail cuaca ${day.date}`}
              onClick={() => setOpenIndex(i)}
              className="group relative flex h-full flex-1 flex-col justify-end"
            >
              {isToday && (
                <span className="absolute -bottom-1 left-0 right-0 h-px animate-pulse bg-[var(--signal-blue)]" />
              )}
              {isHolidayDay && (
                <span className="mx-auto mb-1 size-1.5 rounded-full bg-[var(--signal-blue)]" aria-hidden />
              )}
              <span
                className={`w-full rounded-t-sm transition-all group-hover:brightness-110 ${isToday ? "bg-[var(--signal-blue)]" : "bg-foreground"}`}
                style={{
                  height: `${Math.max(6, intensity)}%`,
                  opacity: isToday ? 1 : TIER_OPACITY[day.confidenceTier],
                }}
              />
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Tinggi = intensitas sinyal hari itu (peluang hujan + kedekatan hari besar) · pekat = pasti, pudar = perkiraan
      </p>

      <DayDetailDialog
        day={openIndex !== null ? days[openIndex] : null}
        holiday={openIndex !== null && holiday?.daysUntil === openIndex ? holiday : null}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
}

function DayDetailDialog({
  day,
  holiday,
  onClose,
}: {
  day: WeatherDay | null;
  holiday: HolidayEntry | null;
  onClose: () => void;
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
                {day.confidenceTier === "actionable" ? "Pasti" : day.confidenceTier === "indicative" ? "Indikatif" : "Perkiraan"}
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
            {holiday && (
              <p className="rounded-md bg-[var(--signal-blue)]/10 p-2 text-sm text-[var(--signal-blue)]">
                {holiday.localName}
                {holiday.isLongWeekend ? ` — long weekend ${holiday.longWeekendDays} hari` : ""}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
