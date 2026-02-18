"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react";

// اگر Sheet داری (shadcn) نگه دار. اگر نداری، می‌تونم نسخه بدون Sheet هم بدم.
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
};

const navMain: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Users", href: "/dashboard/users", icon: Users },
];

const navSettings: NavItem[] = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebarResponsive() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden sticky top-0 z-40 border-b border-white/10 bg-background/30 backdrop-blur-xl">
        <div className="h-14 px-3 flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* Mobile Drawer glass */}
            <SheetContent
              side="left"
              className={cn(
                "p-0 w-[86%] sm:w-[380px]",
                "bg-background/20 backdrop-blur-2xl",
                "border-r border-white/12",
              )}
            >
              <SheetHeader className="p-4 border-b border-white/10">
                <SheetTitle className="text-left">Dashboard</SheetTitle>
              </SheetHeader>

              <MobileSidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Dashboard</div>
            <div className="truncate text-xs text-muted-foreground">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebarDesktop />
      </div>
    </>
  );
}

function AppSidebarDesktop() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 288 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "relative h-screen overflow-hidden",
        "flex flex-col",
        // ✅ Glass background
        "bg-background/20 backdrop-blur-2xl",
        // ✅ White border (subtle) + shadow
        "border-r border-white/12 dark:border-white/10",
        "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
      )}
    >
      {/* ✅ Decorative shine layers (very subtle) */}
      <div className="pointer-events-none absolute inset-0">
        {/* top highlight */}
        <div className="absolute -top-24 left-1/2 h-48 w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl dark:bg-white/6" />
        {/* side tint */}
        <div className="absolute inset-y-0 -left-28 w-56 bg-gradient-to-r from-white/10 to-transparent blur-2xl dark:from-white/6" />
      </div>

      {/* Header */}
      <div className="relative h-16 px-3 flex items-center gap-2 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "h-10 w-10 rounded-xl grid place-items-center",
              "bg-white/10 dark:bg-white/6",
              "border border-white/14 dark:border-white/10",
              "backdrop-blur-xl",
            )}
          >
            <span className="text-sm font-bold">F</span>
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="min-w-0"
              >
                <div className="truncate text-sm font-semibold leading-tight">
                  Fanous{" "}
                  <span className="text-muted-foreground">Dashboard</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  Admin Panel
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto relative">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl",
              "hover:bg-white/10 dark:hover:bg-white/8",
            )}
            onClick={() => setCollapsed((p) => !p)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="relative flex-1">
        <div className="px-2 py-4 space-y-6">
          <NavGroup
            title="Main"
            items={navMain}
            collapsed={collapsed}
            pathname={pathname}
          />
          <NavGroup
            title="Settings"
            items={navSettings}
            collapsed={collapsed}
            pathname={pathname}
          />
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="relative border-t border-white/10 p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full rounded-xl justify-start gap-3",
            "text-destructive hover:text-destructive",
            "hover:bg-white/10 dark:hover:bg-white/8",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </div>
    </motion.aside>
  );
}

function NavGroup({
  title,
  items,
  collapsed,
  pathname,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  pathname: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
          collapsed && "opacity-0 pointer-events-none",
        )}
      >
        {title}
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center rounded-xl",
                collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5",
                "transition-all duration-200",
                item.disabled && "pointer-events-none opacity-50",

                // base hover
                "hover:bg-white/10 dark:hover:bg-white/8",
                // active
                isActive && "bg-white/12 dark:bg-white/10",
              )}
            >
              {/* ✅ Pseudo glow behind icon on hover */}
              <span
                className={cn(
                  "pointer-events-none absolute",
                  collapsed ? "inset-2" : "inset-y-1.5 left-2 w-11",
                  "rounded-xl opacity-0 blur-md",
                  "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),rgba(255,255,255,0.08),transparent_70%)]",
                  "dark:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),rgba(255,255,255,0.06),transparent_70%)]",
                  "group-hover:opacity-100 transition-opacity duration-200",
                  isActive && "opacity-100",
                )}
              />

              {/* left active rail */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full",
                  "bg-white/0",
                  isActive && "bg-primary/80",
                )}
              />

              <Icon
                className={cn(
                  "relative z-10 h-5 w-5 transition-transform duration-200",
                  "group-hover:scale-110",
                  isActive && "scale-110",
                )}
              />

              {!collapsed && (
                <span className="relative z-10 text-sm font-medium">
                  {item.title}
                </span>
              )}

              {/* collapsed tooltip */}
              {collapsed && (
                <span
                  className={cn(
                    "absolute left-full ml-3 px-3 py-2 rounded-lg border",
                    "bg-background/30 backdrop-blur-xl",
                    "border-white/12 dark:border-white/10",
                    "shadow-lg",
                    "opacity-0 -translate-x-1 pointer-events-none whitespace-nowrap",
                    "group-hover:opacity-100 group-hover:translate-x-0",
                    "transition-all duration-200",
                    "z-50",
                  )}
                >
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MobileSidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="px-3 py-4 space-y-6">
          <NavGroup
            title="Main"
            items={navMain}
            collapsed={false}
            pathname={pathname}
          />
          <NavGroup
            title="Settings"
            items={navSettings}
            collapsed={false}
            pathname={pathname}
          />
        </div>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <Button
          variant="ghost"
          onClick={onNavigate}
          className={cn(
            "w-full rounded-xl justify-start gap-3",
            "text-destructive hover:text-destructive",
            "hover:bg-white/10 dark:hover:bg-white/8",
          )}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
}
