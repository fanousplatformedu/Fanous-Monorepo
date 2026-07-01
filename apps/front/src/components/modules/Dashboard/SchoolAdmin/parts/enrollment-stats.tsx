"use client";

import { useI18n } from "@/hooks/useI18n";
import * as T from "@/lib/redux/api";
export const EnrollmentStats = ({}) => {
  const { t } = useI18n();
  const { data: analyticsData } = T.useSchoolStudentsAnalyticsQuery();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.schoolAdmin.enrollments.kpis.totalStudents")}
        </p>
        <p className="mt-2 text-2xl font-bold">{analyticsData?.total}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.schoolAdmin.enrollments.kpis.activeStudents")}
        </p>
        <p className="mt-2 text-2xl font-bold">{analyticsData?.active}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.schoolAdmin.enrollments.kpis.inActiveStudents")}
        </p>
        <p className="mt-2 text-sm font-semibold">{analyticsData?.inActive}</p>
      </div>
    </div>
  );
};
