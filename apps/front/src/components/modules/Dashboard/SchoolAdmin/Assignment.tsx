"use client";

import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { DashboardEmptyState } from "../parts/dashboard-empty-state";
import { DashboardHeader } from "../parts/dashboard-header";
import { DashboardShell } from "../parts/dashboard-shell";
import { DashboardSidebar } from "../parts/dashboard-sidebar";
import { DashboardLoadingCard } from "../parts/dashboard-loading-card";
import { DashboardSection } from "../parts/dashboard-section";
import { StudentResultDetailSummaryStrip } from "@modules/Dashboard/Student/parts/student-result-detail-summary";
import { AssignmentStudentsTable } from "./parts/assignment-students-table";
import { AssignmentUpdateDialog } from "./parts/assignment-update-dialog";
import { useI18n } from "@/hooks/useI18n";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@ui/button";
import { getApiErrorMessage, toIsoFromLocalDateTime, toLocalDateTimeInputValue, formatPersonName } from "@/utils/function-helper";
import { TCreateAssignmentForm } from "@/lib/validation/school-admin-schemas";
import { convertToPersianDate } from "@/utils/jalali-date-conversion";
import { PAGE_SIZE } from "@/utils/constant";
import { toast } from "sonner";
import Link from "next/link";

import * as API from "@/lib/redux/api";
import * as L from "lucide-react";

const ASSIGNMENT_STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  PUBLISHED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  CLOSED: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

const formatDisplayDate = (value?: string | null) => {
  if (!value) return "—";
  return convertToPersianDate(new Date(value).toISOString());
};

export default function AssignmentDetail() {
  const params = useParams();
  const { t } = useI18n();
  const assignmentId = params.assignmentId as string;

  const [page, setPage] = useState(1);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const { data: me } = API.useSchoolAdminMeQuery();
  const schoolId = me?.schoolId ?? "";

  const {
    isLoading,
    isFetching,
    isError,
    isUninitialized,
    data: assignmentData,
    refetch,
  } = API.useAssignmentDetailQuery(
    {
      skip: 0,
      take: 100,
      assignmentId,
    },
    { skip: !assignmentId },
  );

  const { data: gradesData } = API.useGradesQuery(
    { take: 50, skip: 0, schoolId },
    { skip: !schoolId },
  );
  const { data: classroomsData } = API.useClassroomsQuery(
    { take: 50, skip: 0, schoolId },
    { skip: !schoolId },
  );
  const { data: membersData } = API.useSchoolMembersQuery(
    { take: 50, skip: 0, role: "STUDENT" },
    { skip: !schoolId },
  );

  const [updateAssignment, { isLoading: isUpdating }] =
    API.useUpdateAssignmentMutation();

  const allStudents = useMemo(
    () => assignmentData?.studentAssignments ?? [],
    [assignmentData],
  );

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allStudents.slice(start, start + PAGE_SIZE);
  }, [allStudents, page]);

  const gradeOptions = useMemo(
    () =>
      (gradesData?.items ?? []).map((grade) => ({
        value: grade.id,
        label: grade.name + (grade.code ? ` (${grade.code})` : ""),
      })),
    [gradesData],
  );

  const classroomOptions = useMemo(
    () =>
      (classroomsData?.items ?? []).map((classroom) => ({
        value: classroom.id,
        label: classroom.name + (classroom.code ? ` (${classroom.code})` : ""),
      })),
    [classroomsData],
  );

  const studentOptions = useMemo(
    () =>
      (membersData?.items ?? []).map((member) => ({
        value: member.id,
        label: formatPersonName(member.firstName, member.lastName) || member.email || member.id,
      })),
    [membersData],
  );

  const updateInitialValues = useMemo<TCreateAssignmentForm | null>(() => {
    if (!assignmentData) return null;

    return {
      title: assignmentData.title,
      description: assignmentData.description ?? "",
      dueAt: toLocalDateTimeInputValue(assignmentData.dueAt),
      targetMode: assignmentData.targetMode as TCreateAssignmentForm["targetMode"],
      targetGradeId: assignmentData.targetGradeId ?? "",
      targetClassroomId: assignmentData.targetClassroomId ?? "",
      targetStudentIds: assignmentData.targetStudentIds ?? [],
    };
  }, [assignmentData]);

  const studentStats = useMemo(() => {
    const evaluated = allStudents.filter((item) => item.status === "EVALUATED")
      .length;
    const submitted = allStudents.filter(
      (item) => item.status === "SUBMITTED" || item.status === "EVALUATED",
    ).length;
    const inProgress = allStudents.filter(
      (item) => item.status === "IN_PROGRESS",
    ).length;
    const notStarted = allStudents.filter(
      (item) =>
        item.status === "NOT_STARTED" ||
        item.status === "PENDING",
    ).length;

    return { evaluated, submitted, inProgress, notStarted, total: allStudents.length };
  }, [allStudents]);

  const summaryItems = useMemo(
    () => [
      {
        icon: L.Users,
        label: t("dashboard.schoolAdmin.assignmentDetail.stats.totalStudents"),
        value: String(studentStats.total),
      },
      {
        icon: L.Clock3,
        label: t("dashboard.schoolAdmin.assignmentDetail.stats.notStarted"),
        value: String(studentStats.notStarted),
      },
      {
        icon: L.Activity,
        label: t("dashboard.schoolAdmin.assignmentDetail.stats.inProgress"),
        value: String(studentStats.inProgress),
      },
      {
        icon: L.CheckCircle2,
        label: t("dashboard.schoolAdmin.assignmentDetail.stats.evaluated"),
        value: String(studentStats.evaluated),
      },
    ],
    [studentStats, t],
  );

  const getTargetModeLabel = (targetMode: string) =>
    t(`dashboard.schoolAdmin.assignments.targetMode.${targetMode}`);

  const handleUpdate = async (values: TCreateAssignmentForm) => {
    try {
      await updateAssignment({
        assignmentId,
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        dueAt: toIsoFromLocalDateTime(values.dueAt),
        targetMode: values.targetMode,
        targetGradeId: values.targetGradeId || undefined,
        targetClassroomId: values.targetClassroomId || undefined,
        targetStudentIds: values.targetStudentIds?.length
          ? values.targetStudentIds
          : undefined,
      }).unwrap();

      toast.success(
        t("dashboard.schoolAdmin.assignmentDetail.toasts.updateSuccess"),
      );
      setIsUpdateOpen(false);
      await refetch();
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.assignmentDetail.toasts.updateFailed"),
        ),
      );
    }
  };

  const canEdit = assignmentData?.status !== "CLOSED";

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.assignmentDetail.page.title")}
          description={t(
            "dashboard.schoolAdmin.assignmentDetail.page.description",
          )}
        />
      }
      sidebar={
        <DashboardSidebar
          title={t("dashboard.schoolAdmin.shell.title")}
          subtitle={t("dashboard.schoolAdmin.shell.subtitle")}
          items={schoolAdminNav}
        />
      }
    >
      {isLoading || isUninitialized ? (
        <DashboardLoadingCard rows={10} />
      ) : isError ? (
        <DashboardEmptyState
          icon={L.CircleAlert}
          title={t("dashboard.schoolAdmin.assignmentDetail.error.title")}
          description={t(
            "dashboard.schoolAdmin.assignmentDetail.error.description",
          )}
        />
      ) : !assignmentData ? (
        <DashboardEmptyState
          icon={L.FileText}
          title={t("dashboard.schoolAdmin.assignmentDetail.empty.title")}
          description={t(
            "dashboard.schoolAdmin.assignmentDetail.empty.description",
          )}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="brandSoft" size="sm" className="rounded-2xl">
              <Link href="/school-admin/dashboard/assignments">
                <L.ArrowLeft className="h-4 w-4" />
                {t("dashboard.schoolAdmin.assignmentDetail.backToAssignments")}
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              {canEdit ? (
                <Button
                  size="sm"
                  variant="brand"
                  className="rounded-2xl"
                  onClick={() => setIsUpdateOpen(true)}
                >
                  <L.Pencil className="h-4 w-4" />
                  {t("dashboard.schoolAdmin.assignmentDetail.actions.edit")}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.schoolAdmin.assignmentDetail.readOnlyHint")}
                </p>
              )}
            </div>
          </div>

          <DashboardSection className="overflow-hidden p-0">
            <div className="relative bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/10 p-6">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <L.ClipboardList className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          ASSIGNMENT_STATUS_STYLES[assignmentData.status] ??
                            "bg-secondary text-muted-foreground",
                        )}
                      >
                        {t(
                          `dashboard.schoolAdmin.assignments.status.${assignmentData.status}`,
                        )}
                      </span>
                      <span className="inline-flex rounded-full bg-secondary/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {getTargetModeLabel(assignmentData.targetMode)}
                      </span>
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-foreground">
                      {assignmentData.title}
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      {assignmentData.description ||
                        t("dashboard.student.assignments.common.noDescription")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                  <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      {t("dashboard.schoolAdmin.assignmentDetail.meta.dueAt")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDisplayDate(assignmentData.dueAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "dashboard.schoolAdmin.assignmentDetail.meta.publishedAt",
                      )}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDisplayDate(assignmentData.publishedAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "dashboard.schoolAdmin.assignmentDetail.meta.createdAt",
                      )}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDisplayDate(assignmentData.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "dashboard.schoolAdmin.assignmentDetail.meta.updatedAt",
                      )}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDisplayDate(assignmentData.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardSection>

          <StudentResultDetailSummaryStrip items={summaryItems} />

          <AssignmentStudentsTable
            page={page}
            items={paginatedStudents}
            total={allStudents.length}
            onPageChange={setPage}
            isLoading={false}
            isFetching={isFetching}
            assignmentId={assignmentData.id}
          />
        </div>
      )}

      <AssignmentUpdateDialog
        open={isUpdateOpen}
        isSubmitting={isUpdating}
        onOpenChange={setIsUpdateOpen}
        onSubmit={handleUpdate}
        initialValues={updateInitialValues}
        gradeOptions={gradeOptions}
        classroomOptions={classroomOptions}
        studentOptions={studentOptions}
      />
    </DashboardShell>
  );
}
