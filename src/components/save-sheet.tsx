"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bookmark, BellRing } from "lucide-react";
import { toast } from "sonner";
import type { DailyInsight } from "@/lib/types";

export function SaveSheet({ insight }: { insight: DailyInsight | null }) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" size="sm" disabled={!insight} />}
      >
        <Bookmark className="size-4" /> Simpan
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Simpan rekomendasi hari ini</SheetTitle>
          <SheetDescription>{insight?.headline}</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button
            onClick={() => toast.success("Tersimpan. Pengingat akan muncul besok pagi.")}
          >
            <BellRing className="size-4" /> Simpan & ingatkan besok
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
