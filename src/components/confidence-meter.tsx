import type { ConfidenceTier } from "@/lib/types";

const TIER_LABEL: Record<ConfidenceTier, string> = {
  actionable: "Pasti",
  indicative: "Indikatif",
  outlook: "Rendah",
};

export function ConfidenceMeter({ tier, score }: { tier: ConfidenceTier; score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-500"
          style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {TIER_LABEL[tier]} · {Math.round(score)}%
      </span>
    </div>
  );
}
