"use client";

import { TEnrollmentStatsProps } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const EnrollmentStats = ({
  studentsCount,
  classroomsCount,
  selectedClassroomName,
}: TEnrollmentStatsProps) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.schoolAdmin.enrollments.kpis.classrooms")}
        </p>
        <p className="mt-2 text-2xl font-bold">{classroomsCount}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.schoolAdmin.enrollments.kpis.students")}
        </p>
        <p className="mt-2 text-2xl font-bold">{studentsCount}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.schoolAdmin.enrollments.kpis.selectedClassroom")}
        </p>
        <p className="mt-2 text-sm font-semibold">{selectedClassroomName}</p>
      </div>
    </div>
  );
};
