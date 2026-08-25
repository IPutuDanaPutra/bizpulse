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
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LayoutDashboard, Building2, Package, Settings, Info, ChevronsLeft, ChevronsRight, Radar } from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profil Bisnis", icon: Building2 },
  { href: "/menu", label: "Menu & Produk", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const ABOUT = { href: "/about", label: "Tentang", icon: Info } as const;

// Below md, the sidebar becomes the bottom tab bar and doesn't have room for a 5th item —
// "Tentang" moves into Settings on mobile instead (see settings/page.tsx).
const TAB_BAR_NAV = NAV;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="hidden md:flex">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="relative flex size-5 shrink-0 items-center justify-center">
              <Radar className="size-5 text-[var(--signal-blue)]" />
              <span className="absolute -right-0.5 -top-0.5 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--signal-blue)] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[var(--signal-blue)]" />
              </span>
            </span>
            <span className="font-semibold group-data-[collapsible=icon]:hidden">Radar Usaha</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-2">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={active}
                    tooltip={item.label}
                    className={
                      active
                        ? "rounded-l-none border-l-2 border-[var(--signal-blue)] bg-transparent! font-medium text-foreground!"
                        : ""
                    }
                  >
                    <item.icon strokeWidth={active ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <SidebarSeparator className="my-2" />

          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href={ABOUT.href} />}
                isActive={pathname === ABOUT.href}
                tooltip={ABOUT.label}
                className={
                  pathname === ABOUT.href
                    ? "rounded-l-none border-l-2 border-[var(--signal-blue)] bg-transparent! font-medium text-foreground!"
                    : ""
                }
              >
                <ABOUT.icon strokeWidth={pathname === ABOUT.href ? 2.5 : 2} />
                <span>{ABOUT.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between px-2 py-1">
            <ThemeToggle />
            <CollapseToggle />
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

        <main className="flex-1 pb-16 md:pb-0">{children}</main>

        <BottomTabBar pathname={pathname} />
      </SidebarInset>
    </SidebarProvider>
  );
}

function CollapseToggle() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button variant="ghost" size="icon-sm" aria-label="Ciutkan sidebar" onClick={toggleSidebar}>
      {state === "collapsed" ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
    </Button>
  );
}

function BottomTabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-background md:hidden">
      {TAB_BAR_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-xs ${
              active ? "text-[var(--signal-blue)]" : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-5" strokeWidth={active ? 2.5 : 2} />
            {item.label === "Menu & Produk" ? "Menu" : item.label === "Profil Bisnis" ? "Profil" : item.label}
          </Link>
        );
      })}
    </nav>
  );
}
