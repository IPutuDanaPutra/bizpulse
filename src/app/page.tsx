"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Activity } from "lucide-react";
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
      <EmptyState
        icon={Activity}
        headline="Selamat datang di BizPulse"
        body="Lengkapi profil usahamu dulu untuk mulai lihat rekomendasi harian."
        action={<Button render={<Link href="/profile" />}>Isi Profil Bisnis</Button>}
      />
    );
  }

  return <Dashboard profile={profile} />;
}
