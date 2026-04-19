"use client";

import { ChevronDown, LayoutDashboard, LogOut, Settings2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getRoleLabel, getRoleProfilePath } from "@/utils/auth-role-helper";
import { useLogoutCurrentUserMutation } from "@/lib/redux/api";
import { useCurrentUserHeaderQuery } from "@/lib/redux/api";
import { motion, AnimatePresence } from "framer-motion";
import { baseApi, headerAuthApi } from "@/lib/redux/api";
import { getRoleDashboardPath } from "@/utils/auth-role-helper";
import { getUserInitials } from "@/utils/function-helper";
import { TUserMenuProps } from "@/types/elements";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { RoleBadge } from "@elements/role-badge";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import Image from "next/image";

export const UserMenu = ({ mobile = false, onActionDone }: TUserMenuProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUserHeaderQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutCurrentUserMutation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const userMeta = useMemo(() => {
    if (!user) return null;
    const dashboardPath = getRoleDashboardPath(user.role);
    const profilePath = getRoleProfilePath(user.role);
    const displayName = user.fullName || user.email || "User";
    const initials = getUserInitials(user.fullName, user.email);
    const shortName = user.fullName
      ? user.fullName.split(" ").slice(0, 2).join(" ")
      : user.email || "User";
    return {
      dashboardPath,
      profilePath,
      displayName,
      shortName,
      initials,
      roleLabel: getRoleLabel(user.role),
    };
  }, [user]);
  if (!user || !userMeta) return null;
  const avatarNode = user.avatarUrl ? (
    <Image
      fill
      sizes="48px"
      src={user.avatarUrl}
      alt={userMeta.displayName}
      className="rounded-full object-cover"
    />
  ) : (
    <span className="text-sm font-bold">{userMeta.initials}</span>
  );

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      dispatch(
        headerAuthApi.util.upsertQueryData(
          "currentUserHeader",
          undefined,
          null,
        ),
      );
      dispatch(
        baseApi.util.invalidateTags([
          { type: "Auth", id: "SESSION" },
          { type: "Me", id: "CURRENT" },
        ]),
      );
      toast.success(res.message);
      setOpen(false);
      onActionDone?.();
      router.replace("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("common.errors.generic");
      toast.error(message);
    }
  };

  const handleNavigate = (href: string) => {
    setOpen(false);
    onActionDone?.();
    router.push(href);
  };

  if (mobile)
    return (
      <div className="mt-3 rounded-[1.5rem] border border-border/60 bg-card/75 p-3 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(147,197,253,0.12))] text-foreground dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.14),rgba(200,170,130,0.08))]">
            {avatarNode}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {userMeta.shortName}
            </p>
            <div className="mt-1">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => handleNavigate(userMeta.dashboardPath)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/60 text-sm font-medium text-foreground transition hover:bg-card/90"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("dashboard.overview")}
          </button>
          <button
            type="button"
            onClick={() => handleNavigate(userMeta.profilePath)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/60 text-sm font-medium text-foreground transition hover:bg-card/90"
          >
            <Settings2 className="h-4 w-4" />
            {t("dashboard.myProfile")}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] px-4 text-sm font-semibold text-white transition hover:brightness-[1.03] dark:bg-[linear-gradient(135deg,rgba(243,226,199,1),rgba(200,170,130,0.92))] dark:text-[#2a2018]"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? t("common.loading") : t("auth.logout")}
          </button>
        </div>
      </div>
    );

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "group flex items-center gap-3 rounded-full border border-border/60 bg-card/75 py-1.5 pl-1.5 pr-2.5 backdrop-blur-2xl transition hover:bg-card/90",
          open && "bg-card/95",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(147,197,253,0.12))] text-foreground dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.14),rgba(200,170,130,0.08))]">
          {avatarNode}
        </div>

        <div className="hidden min-w-0 sm:block">
          <p className="max-w-[120px] truncate text-left text-sm font-semibold text-foreground">
            {userMeta.shortName}
          </p>
          <div className="mt-0.5">
            <RoleBadge role={user.role} className="align-middle" />
          </div>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-[80] mt-3 w-80 origin-top-right overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/85 shadow-[0_24px_80px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
          >
            <div className="border-b border-border/50 bg-[linear-gradient(135deg,rgba(59,130,246,0.10),rgba(147,197,253,0.06))] p-4 dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.10),rgba(200,170,130,0.06))]">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-card/80 text-foreground">
                  {avatarNode}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {userMeta.displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email || userMeta.roleLabel}
                  </p>
                  <div className="mt-2">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={() => handleNavigate(userMeta.dashboardPath)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-foreground transition hover:bg-card/95"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t("dashboard.overview")}
              </button>

              <button
                type="button"
                onClick={() => handleNavigate(userMeta.profilePath)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-foreground transition hover:bg-card/95"
              >
                <Settings2 className="h-4 w-4" />
                {t("dashboard.myProfile")}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-red-600 transition hover:bg-red-500/8 dark:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? t("common.loading") : t("auth.logout")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
