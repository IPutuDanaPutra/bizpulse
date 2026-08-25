import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import type { DailyInsight } from "@/lib/types";

export function InsightCardSkeleton() {
  return (
    <Card
      className="border-[var(--insight-accent)]/40 bg-[var(--insight-accent)]/5"
    >
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
    </Card>
  );
}

export function InsightCard({ insight, error }: { insight: DailyInsight | null; error?: string }) {
  return (
    <Card className="border-[var(--insight-accent)]/40 bg-[var(--insight-accent)]/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--insight-accent-foreground)]" /> Rekomendasi Hari Ini
          <Badge className="bg-[var(--insight-accent)] text-[var(--insight-accent-foreground)] hover:bg-[var(--insight-accent)]">
            AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : insight ? (
          <div className="flex flex-col gap-1">
            <p className="font-medium">{insight.headline}</p>
            <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
