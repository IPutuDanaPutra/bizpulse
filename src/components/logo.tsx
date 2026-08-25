"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function Logo({ className, height = 24 }: { className?: string; height?: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- avoids an SSR/client theme mismatch flash
    setMounted(true);
  }, []);

  // Width/height ratio from the source SVGs (179.81 x 41) — keeps aspect ratio without a layout jump.
  const width = Math.round((height * 179.81) / 41);
  const src = mounted && resolvedTheme === "dark" ? "/logo/bizpulse-logo-dark-mode.svg" : "/logo/bizpulse-logo-light-mode.svg";

  // Plain <img>, not next/image: Next's image optimizer rejects local SVGs by default, and a static
  // vector logo doesn't benefit from that pipeline anyway.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="BizPulse" width={width} height={height} className={className} />;
}
