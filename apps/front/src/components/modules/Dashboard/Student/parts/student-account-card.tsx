"use client";

import { TStudentAccountCardProps } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const StudentAccountCard = ({ me }: TStudentAccountCardProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-3 rounded-2xl bg-secondary/25 p-4">
      <div className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {t("dashboard.student.profile.account.id")}
        </span>
        <span className="text-sm font-medium text-foreground">{me.id}</span>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {t("dashboard.student.profile.account.schoolId")}
        </span>
        <span className="text-sm font-medium text-foreground">
          {me.schoolId || t("dashboard.student.profile.common.notAvailable")}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {t("dashboard.student.profile.account.role")}
        </span>
        <span className="text-sm font-medium text-foreground">
          {t(`dashboard.student.profile.roles.${me.role}`)}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {t("dashboard.student.profile.account.createdAt")}
        </span>
        <span className="text-sm font-medium text-foreground">
          {me.createdAt ? new Date(me.createdAt).toLocaleString() : "-"}
        </span>
      </div>
    </div>
  );
};
