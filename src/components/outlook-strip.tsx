import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeatherDay } from "@/lib/types";
import { WMO_CODE } from "@/lib/weather";

// Days 8-16 — beyond the radar rings' 7-day range. Forecast confidence is low out here,
// so it's a plain scroll strip, not another ring: the ring metaphor is reserved for the trustworthy range.
export function OutlookStrip({ days }: { days: WeatherDay[] }) {
  const outlook = days.slice(7, 16);
  if (outlook.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">Outlook (perkiraan kasar)</h3>
        <Badge variant="outline" className="text-[10px]">
          8-16 hari
        </Badge>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {outlook.map((d) => {
          const condition = WMO_CODE[d.weatherCode] ?? { label: "-" };
          const weekday = new Date(d.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });
          return (
            <Card
              key={d.date}
              className="flex min-w-24 shrink-0 flex-col items-center gap-1 border-dashed p-3 opacity-70 transition-all hover:scale-[1.01] hover:opacity-100 hover:shadow-md"
            >
              <span className="text-xs text-muted-foreground">{weekday}</span>
              <span className="font-mono text-sm font-medium">
                {Math.round(d.tempMax)}° / {Math.round(d.tempMin)}°
              </span>
              <span className="text-center text-xs text-muted-foreground">{condition.label}</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
