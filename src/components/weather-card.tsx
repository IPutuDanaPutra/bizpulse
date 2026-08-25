import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudRain, Wind, Sun, Droplets } from "lucide-react";
import type { WeatherDay } from "@/lib/types";
import { WMO_CODE } from "@/lib/weather";
import { useCountUp } from "@/hooks/use-count-up";

export function WeatherCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export function WeatherCard({ today }: { today: WeatherDay }) {
  const condition = WMO_CODE[today.weatherCode] ?? { label: "Tidak diketahui", icon: "Sun" as const };
  const tempMax = useCountUp(Math.round(today.tempMax));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="size-4 text-muted-foreground" /> Cuaca Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tabular-nums">{tempMax}°</span>
          <span className="text-muted-foreground">{Math.round(today.tempMin)}° min · {condition.label}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CloudRain className="size-4" /> {today.precipitationProbability}% hujan
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Droplets className="size-4" /> {today.precipitationSum}mm
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Wind className="size-4" /> {today.windSpeedMax} km/h
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
