import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { HolidayEntry } from "@/lib/types";

export function HolidayCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

export function HolidayCard({ holiday }: { holiday: HolidayEntry | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" /> Hari Besar Terdekat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {holiday ? (
          <>
            <div className="text-lg font-medium">{holiday.localName}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{holiday.daysUntil} hari lagi</span>
              {holiday.isLongWeekend && (
                <Badge variant="secondary">Long weekend {holiday.longWeekendDays} hari</Badge>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Tidak ada hari besar dalam waktu dekat.</p>
        )}
      </CardContent>
    </Card>
  );
}
