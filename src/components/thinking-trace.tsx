"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

// Beautiful UI's "Thinking" pattern, adapted: a staged trace of what's being read, shown while the
// recommendation streams in. It's not literally the model's reasoning tokens — DeepSeek's structured-output
// call doesn't expose those — but it makes the wait feel substantive instead of a blank spinner.
const STEPS = ["Membaca cuaca hari ini", "Mengecek kalender", "Mencocokkan dengan produk kamu"];

export function ThinkingTrace() {
  const [expanded, setExpanded] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-fit items-center gap-1.5 hover:text-foreground"
      >
        <Loader2 className="size-3.5 animate-spin" />
        Menyusun rekomendasi...
        <ChevronDown className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <ul className="flex flex-col gap-1 pl-5">
          {STEPS.map((step, i) => (
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
