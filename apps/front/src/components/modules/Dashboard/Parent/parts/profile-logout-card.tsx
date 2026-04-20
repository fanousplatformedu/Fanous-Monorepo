"use client";

import { TProfileLogout } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as L from "lucide-react";

export const ParentLogoutCard = ({
  isSubmitting,
  onLogout,
}: TProfileLogout) => {
  const { t } = useI18n();

  return (
    <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-secondary/30 p-3">
          <L.LogOut className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">
            {t("dashboard.parent.profile.logoutCard.heading")}
          </h4>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("dashboard.parent.profile.logoutCard.text")}
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={onLogout}
        variant="brandSoft"
        disabled={isSubmitting}
        className="w-full rounded-2xl"
      >
        {isSubmitting
          ? t("common.loading")
          : t("dashboard.parent.profile.logoutCard.action")}
      </Button>
    </div>
  );
};
