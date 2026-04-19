"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLogoutCurrentUserMutation } from "@/lib/redux/api";
import { useCurrentUserHeaderQuery } from "@/lib/redux/api";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as D from "@ui/dialog";
import * as L from "lucide-react";
import * as F from "@/utils/force-password";

const ForcePasswordChangeEnforcer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [loginPath, setLoginPath] = useState<string | null>(null);

  const [logout, { isLoading: isLoggingOut }] = useLogoutCurrentUserMutation();

  const {
    data: currentUser,
    isLoading,
    isFetching,
  } = useCurrentUserHeaderQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const hasShownToastRef = useRef(false);

  useEffect(() => {
    const syncFromStorage = () => {
      setPending(F.getForcePasswordPending());
      setLoginPath(F.getForcePasswordLoginPath());
    };
    syncFromStorage();
    window.addEventListener(F.FORCE_PASSWORD_EVENT, syncFromStorage);
    return () => {
      window.removeEventListener(F.FORCE_PASSWORD_EVENT, syncFromStorage);
    };
  }, []);

  const mustChangePassword = useMemo(() => {
    return Boolean(
      currentUser &&
        F.isAdminForcePasswordRole(currentUser.role) &&
        currentUser.forcePasswordChange === true,
    );
  }, [currentUser]);

  const isSettingsPath = useMemo(() => {
    return pathname === F.getSettingsPathByRole(currentUser?.role);
  }, [pathname, currentUser?.role]);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!mustChangePassword) {
      setOpen(false);
      hasShownToastRef.current = false;
      F.clearForcePasswordFlow();
      return;
    }
    if (!pending) {
      setOpen(false);
      return;
    }
    if (isSettingsPath) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (!hasShownToastRef.current) {
      toast.warning(t("auth.forcePassword.toast"));
      hasShownToastRef.current = true;
    }
  }, [isLoading, isFetching, mustChangePassword, pending, isSettingsPath, t]);

  const handleGoToSettings = () => {
    if (!currentUser?.role) return;
    setOpen(false);
    router.push(F.getSettingsPathByRole(currentUser.role));
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      F.clearForcePasswordFlow();
      setOpen(false);
      toast.success(t("auth.logoutSuccess"));
      router.replace(loginPath || "/");
      router.refresh();
    } catch {
      toast.error(t("common.errors.generic"));
    }
  };

  if (!mustChangePassword || !pending || isSettingsPath) return null;

  return (
    <D.Dialog open={open}>
      <D.DialogContent
        hideCloseButton
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="rounded-[1.75rem] border-border/60 bg-card/95 backdrop-blur-2xl sm:max-w-lg"
      >
        <D.DialogHeader>
          <D.DialogTitle className="flex items-center gap-2 text-lg">
            <L.ShieldAlert className="h-5 w-5 text-primary" />
            {t("auth.forcePassword.title", {}, "Password change required")}
          </D.DialogTitle>

          <D.DialogDescription className="leading-7">
            {t("auth.forcePassword.description")}
          </D.DialogDescription>
        </D.DialogHeader>

        <div className="rounded-2xl border border-border/60 bg-secondary/25 p-4 text-sm text-muted-foreground">
          {t("auth.forcePassword.note")}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {t("auth.logout")}
          </Button>

          <Button
            type="button"
            variant="brand"
            className="rounded-2xl"
            onClick={handleGoToSettings}
          >
            {t("auth.forcePassword.goToSettings")}
          </Button>
        </div>
      </D.DialogContent>
    </D.Dialog>
  );
};

export default ForcePasswordChangeEnforcer;
