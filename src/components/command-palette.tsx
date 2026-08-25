"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LayoutDashboard, Building2, Package, Settings, Info } from "lucide-react";

const DESTINATIONS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profil Bisnis", icon: Building2 },
  { href: "/menu", label: "Menu & Produk", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "Tentang", icon: Info },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Lompat ke halaman" description="Cari halaman BizPulse">
      <CommandInput placeholder="Ketik untuk mencari halaman..." />
      <CommandList>
        <CommandEmpty>Tidak ditemukan.</CommandEmpty>
        <CommandGroup heading="Halaman">
          {DESTINATIONS.map((d) => (
            <CommandItem key={d.href} value={d.label} onSelect={() => go(d.href)}>
              <d.icon className="size-4" />
              {d.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
