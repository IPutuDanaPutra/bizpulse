"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCompletion } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, KeyRound } from "lucide-react";
import type { BusinessProfile, DailyInsight, HolidayEntry, MenuItem, WeatherDay } from "@/lib/types";
import { getCachedInsight, setCachedInsight } from "@/lib/insight-cache";

export function InsightCard({
  apiKey,
  profile,
  today,
  holiday,
  menuItems,
}: {
  apiKey: string | null;
  profile: BusinessProfile;
  today: WeatherDay | null;
  holiday: HolidayEntry | null;
  menuItems: MenuItem[];
}) {
  const { completion, complete, setCompletion, isLoading, error } = useCompletion({
    api: "/api/insight",
    streamProtocol: "text",
    onFinish: (_prompt, text) => {
      if (today) setCachedInsight(profile, { date: today.date, text, generatedAt: new Date().toISOString() } satisfies DailyInsight);
    },
  });

  const requestedFor = useRef<string | null>(null);

  function generate() {
    if (!apiKey || !today) return;
    complete("", { body: { weather: today, holiday, profile, menuItems, apiKey } });
  }

  useEffect(() => {
    if (!apiKey || !today) return;
    if (requestedFor.current === today.date) return;
    requestedFor.current = today.date;

    const cached = getCachedInsight(profile, today.date);
    if (cached) {
      setCompletion(cached.text);
      return;
    }
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, today?.date]);

  return (
    <Card className="border-[var(--signal-blue)]/40 bg-[var(--signal-blue)]/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--signal-blue)]" /> Rekomendasi Hari Ini
          <Badge className="bg-[var(--signal-blue)] text-[var(--signal-blue-foreground)] hover:bg-[var(--signal-blue)]">
            AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!apiKey ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              Tambahkan API key di Settings buat dapetin rekomendasi harian.
            </p>
            <Button render={<Link href="/settings" />} size="sm" variant="outline">
              <KeyRound className="size-4" /> Buka Settings
            </Button>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-[var(--error-red)]">Rekomendasi hari ini gagal dibuat.</p>
            <Button size="sm" variant="outline" onClick={generate}>
              Coba lagi
            </Button>
          </div>
        ) : completion ? (
          <p className="text-sm">{completion}</p>
        ) : isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : (
          <Skeleton className="h-4 w-full" />
        )}
      </CardContent>
    </Card>
  );
}
