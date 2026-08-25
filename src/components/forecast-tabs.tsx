import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeatherDay } from "@/lib/types";
import { WMO_CODE } from "@/lib/weather";

const TIER_LABEL = {
  actionable: "Pasti",
  indicative: "Indikatif",
  outlook: "Perkiraan",
} as const;

function DayCard({ day }: { day: WeatherDay }) {
  const condition = WMO_CODE[day.weatherCode] ?? { label: "-" };
  const weekday = new Date(day.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });

  return (
    <Card className="flex min-w-28 shrink-0 flex-col items-center gap-1.5 p-3 transition-all hover:scale-[1.01] hover:shadow-md">
      <span className="text-xs text-muted-foreground">{weekday}</span>
      <Badge variant={day.confidenceTier === "actionable" ? "default" : "outline"} className="text-[10px]">
        {TIER_LABEL[day.confidenceTier]}
      </Badge>
      <span className="text-sm font-medium">{Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°</span>
      <span className="text-center text-xs text-muted-foreground">{condition.label}</span>
      <span className="text-xs text-muted-foreground">{day.precipitationProbability}% hujan</span>
    </Card>
  );
}

export function ForecastTabs({ days }: { days: WeatherDay[] }) {
  const week = days.slice(0, 7);
  const outlook = days.slice(7, 16);

  return (
    <Tabs defaultValue="week">
      <TabsList>
        <TabsTrigger value="week">Minggu ini</TabsTrigger>
        <TabsTrigger value="outlook">Outlook</TabsTrigger>
      </TabsList>
      <TabsContent value="week">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {week.map((d) => (
            <DayCard key={d.date} day={d} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="outlook">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {outlook.map((d) => (
            <DayCard key={d.date} day={d} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
