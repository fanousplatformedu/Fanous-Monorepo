"use client";

import { TStudentProfileSummaryCardProps } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const StudentProfileSummaryCard = ({
  me,
  isFetching,
}: TStudentProfileSummaryCardProps) => {
  const { t } = useI18n();

  const completionParts = [
    Boolean(me.fullName),
    Boolean(me.email),
    Boolean(me.mobile),
    Boolean(me.avatarUrl),
  ];

  const completed = completionParts.filter(Boolean).length;
  const completion = Math.round((completed / completionParts.length) * 100);

  const roleLabel =
    t(`dashboard.student.profile.roles.${me.role}`) || me.role || "-";

  const statusLabel = me.status
    ? t(`dashboard.student.profile.status.${me.status}`)
    : t("dashboard.student.profile.common.notAvailable");

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.student.profile.summary.fullName")}
        </p>
        <p className="mt-2 text-lg font-semibold">
          {me.fullName || t("dashboard.student.profile.common.notSet")}
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.student.profile.summary.role")}
        </p>
        <p className="mt-2 text-lg font-semibold">{roleLabel}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.student.profile.summary.status")}
        </p>
        <p className="mt-2 text-lg font-semibold">{statusLabel}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.student.profile.summary.profileCompletion")}
        </p>
        <p className="mt-2 text-lg font-semibold">{completion}%</p>
        {isFetching ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {t("common.refreshing", {}, "Refreshing...")}
          </p>
        ) : null}
      </div>
    </div>
  );
};
