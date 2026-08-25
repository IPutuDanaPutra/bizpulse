"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useObject } from "@ai-sdk/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, KeyRound, Check, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ThinkingTrace } from "@/components/thinking-trace";
import { ConfidenceMeter } from "@/components/confidence-meter";
import { RecommendationSchema } from "@/lib/recommendation-schema";
import type { BusinessProfile, HolidayEntry, MenuItem, Recommendation, WeatherDay } from "@/lib/types";
import { getCachedRecommendation, setCachedRecommendation } from "@/lib/insight-cache";

export function RecommendationCard({
  apiKey,
  profile,
  today,
  holiday,
  menuItems,
  onOpenChat,
}: {
  apiKey: string | null;
  profile: BusinessProfile;
  today: WeatherDay | null;
  holiday: HolidayEntry | null;
  menuItems: MenuItem[];
  onOpenChat: () => void;
}) {
  const [cached, setCached] = useState<Recommendation | null>(null);
  const [applied, setApplied] = useState(false);
  const requestedFor = useRef<string | null>(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/insight",
    schema: RecommendationSchema,
    onFinish: ({ object: finished }) => {
      if (today && finished) {
        setCachedRecommendation(profile, {
          date: today.date,
          headline: finished.headline,
          reasoning: finished.reasoning,
          confidenceTier: finished.confidenceTier,
          confidenceScore: finished.confidenceScore,
          primaryAction: finished.primaryAction,
          alternatives: finished.alternatives ?? [],
          generatedAt: new Date().toISOString(),
        });
      }
    },
  });

  function generate() {
    if (!apiKey || !today) return;
    setCached(null);
    submit({ weather: today, holiday, profile, menuItems, apiKey });
  }

  useEffect(() => {
    if (!apiKey || !today) return;
    if (requestedFor.current === today.date) return;
    requestedFor.current = today.date;
    setApplied(false);

    const hit = getCachedRecommendation(profile, today.date);
    if (hit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from a same-day cache hit, not derivable from render
      setCached(hit);
      return;
    }
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, today?.date]);

  const rec = cached ?? object;

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
          <EmptyState
            icon={KeyRound}
            headline="Belum terhubung ke AI"
            body="Tambahkan API key di Settings buat dapetin rekomendasi harian."
            action={
              <Button render={<Link href="/settings" />} size="sm" variant="outline">
                <KeyRound className="size-4" /> Buka Settings
              </Button>
            }
          />
        ) : error ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-[var(--error-red)]">Rekomendasi hari ini gagal dibuat.</p>
            <Button size="sm" variant="outline" onClick={generate}>
              Coba lagi
            </Button>
          </div>
        ) : !rec?.headline && isLoading ? (
          <ThinkingTrace />
        ) : rec ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-lg font-semibold leading-snug">{rec.headline}</p>
              {rec.reasoning && <p className="text-sm text-muted-foreground">{rec.reasoning}</p>}
            </div>

            {rec.confidenceTier && rec.confidenceScore != null && (
              <ConfidenceMeter tier={rec.confidenceTier} score={rec.confidenceScore} />
            )}

            {rec.primaryAction && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  disabled={applied}
                  onClick={() => {
                    setApplied(true);
                    toast.success("Diterapkan.");
                  }}
                >
                  {applied ? <Check className="size-4" /> : null}
                  {applied ? "Diterapkan" : "Terapkan"}
                </Button>
                <p className="text-sm font-medium">{rec.primaryAction}</p>
              </div>
            )}

            {rec.alternatives && rec.alternatives.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Alternatif lain</p>
                  {rec.alternatives.map((alt, i) =>
                    alt?.label ? (
                      <div key={i} className="flex items-center justify-between gap-3 text-sm">
                        <span>{alt.label}</span>
                        {alt.confidence != null && (
                          <span className="shrink-0 text-xs text-muted-foreground">{Math.round(alt.confidence)}%</span>
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              </>
            )}

            <Separator />
            <Button size="sm" variant="ghost" className="self-start" onClick={onOpenChat}>
              <MessageSquare className="size-4" /> Chat lebih lanjut
            </Button>
          </div>
        ) : (
          <ThinkingTrace />
        )}
      </CardContent>
    </Card>
  );
}
