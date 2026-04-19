"use client";

import { TClassroomRow, TEditClassroomTarget } from "@/types/modules";
import { TFilterValues, TGradeOption } from "@/types/modules";
import { ALL_GRADES_VALUE, PAGE_SIZE } from "@/utils/constant";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { ClassroomCreateForm } from "@modules/Dashboard/SchoolAdmin/parts/classroom-form";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { ClassroomFilters } from "@modules/Dashboard/SchoolAdmin/parts/classroom-filters";
import { ClassroomDialog } from "@modules/Dashboard/SchoolAdmin/parts/classroom-dialog";
import { ClassroomTable } from "@modules/Dashboard/SchoolAdmin/parts/classroom-table";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as T from "@/lib/redux/api";
import * as L from "lucide-react";

const SchoolAdminClassroomsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TFilterValues>({
    query: "",
    gradeId: "",
    scope: "ACTIVE_ONLY",
  });
  const [editTarget, setEditTarget] = useState<TEditClassroomTarget | null>(
    null,
  );

  const { data: me, isLoading: isMeLoading } = T.useSchoolAdminMeQuery();
  const schoolId = me?.schoolId ?? "";

  const {
    data: gradesData,
    isLoading: isGradesLoading,
    isFetching: isGradesFetching,
  } = T.useGradesQuery(
    {
      schoolId,
      take: 100,
      skip: 0,
      includeDeleted: false,
    },
    { skip: !schoolId },
  );

  const skip = (page - 1) * PAGE_SIZE;

  const {
    data: classroomsData,
    isLoading: isClassroomsLoading,
    isFetching: isClassroomsFetching,
  } = T.useClassroomsQuery(
    {
      schoolId,
      take: PAGE_SIZE,
      skip,
      includeDeleted: filters.scope === "ALL",
      gradeId: filters.gradeId || undefined,
      query: filters.query.trim() || undefined,
    },
    { skip: !schoolId },
  );

  const [createClassroom, { isLoading: isCreating }] =
    T.useCreateClassroomMutation();

  const [updateClassroom, { isLoading: isUpdating }] =
    T.useUpdateClassroomMutation();

  const [archiveClassroom, { isLoading: isArchiving }] =
    T.useArchiveClassroomMutation();

  const [restoreClassroom, { isLoading: isRestoring }] =
    T.useRestoreClassroomMutation();

  const grades = useMemo(
    () => gradesData?.items?.filter((item) => !item.deletedAt) ?? [],
    [gradesData],
  );

  const gradeOptions: TGradeOption[] = useMemo(
    () =>
      grades.map((grade) => ({
        value: grade.id,
        label: grade.code ? `${grade.name} (${grade.code})` : grade.name,
      })),
    [grades],
  );

  const gradeMap = useMemo(
    () =>
      new Map(
        grades.map((grade) => [
          grade.id,
          {
            name: grade.name,
            code: grade.code,
          },
        ]),
      ),
    [grades],
  );

  const classrooms: TClassroomRow[] = useMemo(
    () => classroomsData?.items ?? [],
    [classroomsData],
  );

  const total = classroomsData?.total ?? 0;

  const activeCount = useMemo(
    () => classrooms.filter((item) => !item.deletedAt).length,
    [classrooms],
  );

  const archivedCount = useMemo(
    () => classrooms.filter((item) => !!item.deletedAt).length,
    [classrooms],
  );

  const getClassroomErrorMessage = (error: unknown, fallback: string) => {
    const message = getApiErrorMessage(error, fallback);
    if (
      message.includes("Unique constraint failed") &&
      message.includes("schoolId") &&
      message.includes("code")
    ) {
      return t("dashboard.schoolAdmin.classrooms.toasts.duplicateCode");
    }
    return message;
  };

  const handleCreate = async (values: {
    gradeId: string;
    name: string;
    code?: string;
    year?: string;
  }) => {
    if (!schoolId) {
      toast.error(t("dashboard.schoolAdmin.classrooms.toasts.schoolMissing"));
      return;
    }
    try {
      await createClassroom({
        schoolId,
        gradeId: values.gradeId,
        name: values.name.trim(),
        code: values.code?.trim() || undefined,
        year: values.year ? Number(values.year) : undefined,
      }).unwrap();
      toast.success(t("dashboard.schoolAdmin.classrooms.toasts.createSuccess"));
      setPage(1);
    } catch (error: unknown) {
      toast.error(
        getClassroomErrorMessage(
          error,
          t("dashboard.schoolAdmin.classrooms.toasts.createFailed"),
        ),
      );
    }
  };

  const handleUpdate = async (values: {
    id: string;
    gradeId: string;
    name: string;
    code?: string;
    year?: string;
  }) => {
    try {
      await updateClassroom({
        id: values.id,
        gradeId: values.gradeId,
        name: values.name.trim(),
        code: values.code?.trim() || undefined,
        year: values.year ? Number(values.year) : undefined,
      }).unwrap();
      toast.success(t("dashboard.schoolAdmin.classrooms.toasts.updateSuccess"));
      setEditTarget(null);
    } catch (error: unknown) {
      toast.error(
        getClassroomErrorMessage(
          error,
          t("dashboard.schoolAdmin.classrooms.toasts.updateFailed"),
        ),
      );
    }
  };

  const handleToggleArchive = async (
    classroomId: string,
    deletedAt: string | Date | null,
  ) => {
    try {
      if (deletedAt) {
        await restoreClassroom(classroomId).unwrap();
        toast.success(
          t("dashboard.schoolAdmin.classrooms.toasts.restoreSuccess"),
        );
      } else {
        await archiveClassroom(classroomId).unwrap();
        toast.success(
          t("dashboard.schoolAdmin.classrooms.toasts.archiveSuccess"),
        );
      }
    } catch (error: unknown) {
      toast.error(
        getClassroomErrorMessage(
          error,
          t("dashboard.schoolAdmin.classrooms.toasts.statusFailed"),
        ),
      );
    }
  };

  const handleApplyFilters = (values: {
    query: string;
    gradeId: string;
    scope: "ACTIVE_ONLY" | "ALL";
  }) => {
    setPage(1);
    setFilters(values);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      query: "",
      gradeId: "",
      scope: "ACTIVE_ONLY",
    });
  };

  if (isMeLoading || isGradesLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <DashboardSection
          title={t("dashboard.schoolAdmin.classrooms.createCard.title")}
          description={t(
            "dashboard.schoolAdmin.classrooms.createCard.description",
          )}
        >
          <ClassroomCreateForm
            onSubmit={handleCreate}
            isSubmitting={isCreating}
            gradeOptions={gradeOptions}
          />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.schoolAdmin.classrooms.filtersCard.title")}
          description={t(
            "dashboard.schoolAdmin.classrooms.filtersCard.description",
          )}
        >
          <ClassroomFilters
            initialValues={{
              query: filters.query,
              gradeId: filters.gradeId || ALL_GRADES_VALUE,
              scope: filters.scope,
            }}
            gradeOptions={[
              {
                value: ALL_GRADES_VALUE,
                label: t("dashboard.schoolAdmin.classrooms.filters.allGrades"),
              },
              ...gradeOptions,
            ]}
            onApply={(values) =>
              handleApplyFilters({
                query: values.query,
                gradeId:
                  values.gradeId === ALL_GRADES_VALUE ? "" : values.gradeId,
                scope: values.scope,
              })
            }
            onReset={handleResetFilters}
          />
        </DashboardSection>

        {isClassroomsLoading ? (
          <DashboardLoadingCard rows={8} />
        ) : !classrooms.length ? (
          <DashboardEmptyState
            icon={L.School}
            title={t("dashboard.schoolAdmin.classrooms.empty.title")}
            description={t(
              "dashboard.schoolAdmin.classrooms.empty.description",
            )}
          />
        ) : (
          <ClassroomTable
            page={page}
            total={total}
            gradeMap={gradeMap}
            pageSize={PAGE_SIZE}
            classrooms={classrooms}
            isUpdating={isUpdating}
            activeCount={activeCount}
            isArchiving={isArchiving}
            isRestoring={isRestoring}
            archivedCount={archivedCount}
            isFetching={isClassroomsFetching || isGradesFetching}
            onPageChange={setPage}
            onEdit={(classroom) =>
              setEditTarget({
                id: classroom.id,
                gradeId: classroom.gradeId,
                name: classroom.name,
                code: classroom.code ?? "",
                year: classroom.year ? String(classroom.year) : "",
              })
            }
            onToggleArchive={handleToggleArchive}
          />
        )}
      </div>

      <ClassroomDialog
        open={!!editTarget}
        isSubmitting={isUpdating}
        initialValues={editTarget}
        gradeOptions={gradeOptions}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        onSubmit={handleUpdate}
      />
    </>
  );
};

export default SchoolAdminClassroomsPage;
