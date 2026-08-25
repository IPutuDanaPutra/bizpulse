"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { MapPin } from "lucide-react";
import { getProfile } from "@/lib/local-store";
import type { BusinessProfile } from "@/lib/types";

export default function Home() {
  const [profile, setProfile] = useState<BusinessProfile | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount, not derivable from props/state
    setProfile(getProfile());
  }, []);

  if (profile === undefined) return null;

  // Hard dependency (v5 §7): never call the weather API with a guessed/default location.
  // A profile without real coordinates is treated the same as no profile at all.
  const hasLocation = !!profile?.location?.lat && !!profile?.location?.lon;

  if (!profile || !hasLocation) {
    return (
      <EmptyState
        icon={MapPin}
        headline="Lengkapi lokasi usaha kamu dulu"
        body="Buat lihat rekomendasi hari ini, BizPulse butuh lokasi usahamu dulu di Profil Bisnis."
        action={<Button render={<Link href="/profile" />}>Isi Profil Bisnis</Button>}
      />
    );
  }

  return <Dashboard profile={profile} />;
}
