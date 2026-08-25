import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function FieldHint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<button type="button" aria-label="Info" className="text-muted-foreground" />}>
        <Info className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
