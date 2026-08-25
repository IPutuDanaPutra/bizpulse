import type { HolidayEntry, WeatherDay } from "@/lib/types";

// v5 §4: a plain navigation strip, not a chart — no height/opacity encoding to "read."
// Today filled with --primary, the rest muted outlines. Tapping a day jumps the Recommendation
// Card to that day, the way a calendar's week view works.
export function DayStrip({
  days,
  holiday,
  selectedIndex,
  onSelect,
  interactive = true,
}: {
  days: WeatherDay[];
  holiday: HolidayEntry | null;
  selectedIndex: number;
  onSelect?: (index: number) => void;
  interactive?: boolean;
}) {
  const week = days.slice(0, 7);

  return (
    <div className="flex w-full gap-2">
      {week.map((day, i) => {
        const isSelected = i === selectedIndex;
        const weekday = new Date(day.date).toLocaleDateString("id-ID", { weekday: "short" });
        const dayNum = new Date(day.date).getDate();
        const isHolidayDay = holiday && holiday.daysUntil === i;

        const Tag = interactive ? "button" : "div";
        return (
          <Tag
            key={day.date}
            {...(interactive ? { onClick: () => onSelect?.(i), type: "button" as const } : {})}
            className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-colors ${
              isSelected
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            <span className="text-[11px] uppercase">{weekday}</span>
            <span className="text-sm font-medium">{dayNum}</span>
            <span
              className={`size-1 rounded-full ${isHolidayDay ? (isSelected ? "bg-[var(--primary-foreground)]" : "bg-[var(--primary)]") : "bg-transparent"}`}
              aria-hidden
            />
          </Tag>
        );
      })}
    </div>
  );
}
