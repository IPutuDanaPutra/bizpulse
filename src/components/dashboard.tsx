"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWeather } from "@/lib/weather";
import { fetchNextHolidays } from "@/lib/holidays";
import { getApiKey, getMenuItems } from "@/lib/local-store";
import type { BusinessProfile, HolidayEntry, MenuItem, WeatherDay } from "@/lib/types";
import { BUSINESS_CATEGORY_LABELS } from "@/lib/types";
import { PulseStrip } from "@/components/pulse-strip";
import { RecommendationCard } from "@/components/recommendation-card";
import { ChatPanel } from "@/components/chat-panel";
import { HolidayCard, HolidayCardSkeleton } from "@/components/holiday-card";
import { WeatherDetailCard, WeatherDetailCardSkeleton } from "@/components/weather-detail-card";
import { RelevantProductsCard } from "@/components/relevant-products-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Pencil } from "lucide-react";

export function Dashboard({ profile }: { profile: BusinessProfile }) {
  const [weather, setWeather] = useState<WeatherDay[] | null>(null);
  const [holidays, setHolidays] = useState<HolidayEntry[] | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyLoaded, setKeyLoaded] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount
    setApiKey(getApiKey());
    setKeyLoaded(true);
    setMenuItems(getMenuItems());
    let cancelled = false;
    fetchWeather(profile.location.lat, profile.location.lon).then((d) => !cancelled && setWeather(d));
    fetchNextHolidays().then((d) => !cancelled && setHolidays(d));
    return () => {
      cancelled = true;
    };
  }, [profile.location.lat, profile.location.lon]);

  const nextHoliday = holidays?.[0] ?? null;
  const today = weather?.[0] ?? null;

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{profile.businessName}</h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {profile.location.label.split(",")[0]} · {BUSINESS_CATEGORY_LABELS[profile.category]}
          </div>
        </div>
        <Button render={<Link href="/profile" />} variant="ghost" size="sm">
          <Pencil className="size-4" /> Edit profil
        </Button>
      </div>

      <div className="stagger-in" style={{ animationDelay: "0ms" }}>
        {weather ? (
          <PulseStrip days={weather} holiday={nextHoliday} />
        ) : (
          <Skeleton className="h-28 w-full" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="stagger-in" style={{ animationDelay: "120ms" }}>
          {today && keyLoaded ? (
            <RecommendationCard
              apiKey={apiKey}
              profile={profile}
              today={today}
              holiday={nextHoliday}
              menuItems={menuItems}
              onOpenChat={() => setChatOpen(true)}
            />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="stagger-in" style={{ animationDelay: "180ms" }}>
            {today ? <WeatherDetailCard today={today} /> : <WeatherDetailCardSkeleton />}
          </div>
          <div className="stagger-in" style={{ animationDelay: "240ms" }}>
            {holidays ? <HolidayCard holiday={nextHoliday} /> : <HolidayCardSkeleton />}
          </div>
          <div className="stagger-in" style={{ animationDelay: "300ms" }}>
            <RelevantProductsCard items={menuItems} />
          </div>
        </div>
      </div>

      <ChatPanel
        open={chatOpen}
        onOpenChange={setChatOpen}
        apiKey={apiKey}
        profile={profile}
        today={today}
        holiday={nextHoliday}
        menuItems={menuItems}
      />
    </div>
  );
}
