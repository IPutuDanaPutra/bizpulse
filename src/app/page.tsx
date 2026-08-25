"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Radar } from "lucide-react";
import { getProfile } from "@/lib/local-store";
import type { BusinessProfile } from "@/lib/types";

export default function Home() {
  const [profile, setProfile] = useState<BusinessProfile | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount, not derivable from props/state
    setProfile(getProfile());
  }, []);

  if (profile === undefined) return null;

  if (profile === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <Radar className="size-10 text-[var(--signal-blue)]" />
        <div>
          <h1 className="text-xl font-semibold">Selamat datang di Radar Usaha</h1>
          <p className="text-sm text-muted-foreground">Lengkapi profil usahamu dulu untuk mulai lihat rekomendasi harian.</p>
        </div>
        <Button render={<Link href="/profile" />}>Isi Profil Usaha</Button>
      </div>
    );
  }

  return <Dashboard profile={profile} />;
}
