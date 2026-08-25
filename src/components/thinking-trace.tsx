"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

// Beautiful UI's "Thinking" pattern, adapted: a staged trace of what's being read, shown while a reply
// streams in. It's not literally the model's reasoning tokens — DeepSeek's structured-output/chat calls
// don't expose those — but it makes the wait feel substantive instead of a blank spinner.
const DEFAULT_STEPS = ["Membaca cuaca hari ini", "Mengecek kalender", "Mencocokkan dengan produk kamu"];

export function ThinkingTrace({
  steps = DEFAULT_STEPS,
  label = "Menyusun rekomendasi...",
}: {
  steps?: readonly string[];
  label?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-fit items-center gap-1.5 hover:text-foreground"
      >
        <Loader2 className="size-3.5 animate-spin" />
        {label}
        <ChevronDown className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <ul className="flex flex-col gap-1 pl-5">
          {steps.map((step, i) => (
            <li key={step} className={i <= stepIndex ? "text-foreground" : "opacity-50"}>
              {step}
              {i === stepIndex ? "..." : i < stepIndex ? " ✓" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
