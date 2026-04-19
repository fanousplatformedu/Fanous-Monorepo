"use client";

import { TStudentLogoutCardProps } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const StudentLogoutCard = ({
  isSubmitting,
  onLogout,
}: TStudentLogoutCardProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-5">
      <div>
        <p className="text-sm font-medium text-foreground">
          {t("dashboard.student.profile.logout.title")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboard.student.profile.logout.description")}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onLogout}
          variant="brandSoft"
          className="rounded-2xl"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("dashboard.student.profile.actions.loggingOut")
            : t("dashboard.student.profile.actions.logout")}
        </Button>
      </div>
    </div>
  );
};
