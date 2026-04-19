"use client";

import { TDashboardSidebarProps } from "@/types/elements";
import { TDashboardIconName } from "@/types/constant";
import { usePathname } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import Link from "next/link";

import * as L from "lucide-react";

const iconMap: Record<TDashboardIconName, L.LucideIcon> = {
  Bell: L.Bell,
  Users: L.Users,
  Brain: L.Brain,
  School: L.School,
  Settings: L.Settings,
  FileText: L.FileText,
  UserPlus2: L.UserPlus2,
  UserRound: L.UserRound,
  Settings2: L.Settings2,
  BadgeHelp: L.BadgeHelp,
  ScrollText: L.ScrollText,
  UsersRound: L.UsersRound,
  UserCheck2: L.UserCheck2,
  NotebookPen: L.NotebookPen,
  ClipboardList: L.ClipboardList,
  GraduationCap: L.GraduationCap,
  UserRoundCheck: L.UserRoundCheck,
  ChartColumnBig: L.ChartColumnBig,
  MessagesSquare: L.MessagesSquare,
  LayoutDashboard: L.LayoutDashboard,
};

export const DashboardSidebar = ({
  title,
  subtitle,
  items,
}: TDashboardSidebarProps) => {
  const pathname = usePathname();
  const { t } = useI18n();

  const isItemActive = (href: string) => {
    if (href === "/student/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="rounded-[2rem] border border-border/60 bg-card/65 p-4 backdrop-blur-2xl">
      <div className="mb-5 rounded-[1.5rem] border border-border/50 bg-card/55 p-4">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <nav className="space-y-1.5">
        {items.map((item) => {
          const active = isItemActive(item.href);
          const Icon = iconMap[item.icon];

          return (
            <Link key={item.key} href={item.href} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all",
                  active
                    ? "bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(147,197,253,0.12))] text-foreground shadow-sm dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.14),rgba(200,170,130,0.08))]"
                    : "text-muted-foreground hover:bg-card/75 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{t(item.labelKey)}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
