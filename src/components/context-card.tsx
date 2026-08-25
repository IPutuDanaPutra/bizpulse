import { Package } from "lucide-react";
import type { MenuItem } from "@/lib/types";

// Beautiful UI's Context Cards pattern — but only ever cites the user's OWN data (v5 §3):
// never Open-Meteo/Nager.Date, those facts are just stated in the reply text directly.
export function ContextCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs">
      <Package className="size-3.5 text-muted-foreground" />
      <span className="font-medium">{item.name}</span>
      <span className="text-muted-foreground">— dari Menu & Produk kamu</span>
    </div>
  );
}
