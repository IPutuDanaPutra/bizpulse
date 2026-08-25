"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Radar, User, UtensilsCrossed, Settings } from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: Radar },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/menu", label: "Menu & Produk", icon: UtensilsCrossed },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="hidden md:flex">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Radar className="size-5 shrink-0 text-[var(--signal-blue)]" />
            <span className="font-semibold group-data-[collapsible=icon]:hidden">Radar Usaha</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-2">
            {NAV.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Tema</span>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
          <Radar className="size-5 text-[var(--signal-blue)]" />
          <span className="font-semibold">Radar Usaha</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <header className="hidden h-14 items-center gap-2 border-b px-4 md:flex">
          <SidebarTrigger />
        </header>

        <main className="flex-1 pb-16 md:pb-0">{children}</main>

        <BottomTabBar pathname={pathname} />
      </SidebarInset>
    </SidebarProvider>
  );
}

function BottomTabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-background md:hidden">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-xs ${
              active ? "text-[var(--signal-blue)]" : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-5" />
            {item.label === "Menu & Produk" ? "Menu" : item.label}
          </Link>
        );
      })}
    </nav>
  );
}
