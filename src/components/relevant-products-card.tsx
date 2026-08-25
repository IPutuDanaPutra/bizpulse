import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Package, Tag } from "lucide-react";
import type { MenuItem } from "@/lib/types";

export function RelevantProductsCard({ items }: { items: MenuItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" /> Produk Kamu
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={Package}
            headline="Belum ada produk"
            body="Tambahkan menu supaya rekomendasi bisa sebut produk spesifik."
            action={
              <Button render={<Link href="/menu" />} size="sm" variant="outline">
                Tambah Produk
              </Button>
            }
            className="py-4"
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {items.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate">{item.name}</span>
                {item.price != null && (
                  <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
                    <Tag className="size-3" /> Rp{item.price.toLocaleString("id-ID")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
