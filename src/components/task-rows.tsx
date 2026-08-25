"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Circle } from "lucide-react";

// Beautiful UI's Task Rows pattern: live per-step status instead of one generic spinner.
// The API call itself isn't staged, so progress through the steps is a timed approximation —
// it still finishes at "Selesai" only once the real request actually resolves.
export function useStagedProgress(steps: readonly string[], running: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting progress when a new run stops, not derivable from render
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 2));
    }, 900);
    return () => clearInterval(interval);
  }, [running, steps.length]);

  return index;
}

export function TaskRows({
  steps,
  activeIndex,
  done,
}: {
  steps: readonly string[];
  activeIndex: number;
  done: boolean;
}) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      {steps.map((step, i) => {
        const isDone = done || i < activeIndex;
        const isActive = !done && i === activeIndex;
        return (
          <li key={step} className={`flex items-center gap-2 ${isDone || isActive ? "text-foreground" : "text-muted-foreground/50"}`}>
            {isDone ? (
              <Check className="size-3.5 text-[var(--primary)]" />
            ) : isActive ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Circle className="size-3.5" />
            )}
            {step}
          </li>
        );
      })}
    </ul>
  );
}
