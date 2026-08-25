import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CloudRain, Wind, Droplets, Sun } from "lucide-react";
import type { WeatherDay } from "@/lib/types";
import { WMO_CODE } from "@/lib/weather";
import { useCountUp } from "@/hooks/use-count-up";

export function WeatherDetailCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-10 w-24" />
        <Separator />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

// Multi-element by design (v4 §6): the number alone would read as sparse — pair it with the
// condition, precipitation, and wind so the card's padding is doing something.
export function WeatherDetailCard({ today }: { today: WeatherDay }) {
  const condition = WMO_CODE[today.weatherCode] ?? { label: "Tidak diketahui" };
  const tempMax = useCountUp(Math.round(today.tempMax));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="size-4 text-muted-foreground" /> Cuaca Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl font-semibold tabular-nums">{tempMax}°</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(today.tempMin)}° min · {condition.label}
          </span>
        </div>
        <Separator />
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CloudRain className="size-4" /> {today.precipitationProbability}% peluang hujan · {today.precipitationSum}mm
          </span>
          <span className="flex items-center gap-1.5">
            <Wind className="size-4" /> Angin {today.windSpeedMax} km/h
          </span>
          <span className="flex items-center gap-1.5">
            <Droplets className="size-4" /> UV index {today.uvIndexMax}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
