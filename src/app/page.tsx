"use client";

import { useEffect, useState } from "react";
import { Onboarding } from "@/components/onboarding";
import { Dashboard } from "@/components/dashboard";
import type { BusinessContext } from "@/lib/types";

const STORAGE_KEY = "radar-usaha:business-context";

export default function Home() {
  const [ctx, setCtx] = useState<BusinessContext | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount, not derivable from props/state
      if (raw) setCtx(JSON.parse(raw));
    } catch {
      // ignore — falls back to onboarding
    }
    setLoaded(true);
  }, []);

  function saveCtx(next: BusinessContext) {
    setCtx(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — context still works for this session
    }
  }

  function reset() {
    setCtx(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  if (!loaded) return null;

  return ctx ? <Dashboard ctx={ctx} onReset={reset} /> : <Onboarding onDone={saveCtx} />;
}
