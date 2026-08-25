import { CloudSun, CalendarDays, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Beautiful UI's Context Cards pattern, adapted as a citation strip: which data sources this
// conversation is grounded in — cheap trust signal, and honest about what the AI can and can't see.
export function ContextCards({ hasMenuItems }: { hasMenuItems: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
        <CloudSun className="size-3" /> Open-Meteo
      </Badge>
      <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
        <CalendarDays className="size-3" /> Nager.Date
      </Badge>
      {hasMenuItems && (
        <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
          <Package className="size-3" /> Produk kamu
        </Badge>
      )}
    </div>
  );
}
