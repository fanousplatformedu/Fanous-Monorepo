"use client";

import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { TGradeDialogState } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { GradeEditDialog } from "@modules/Dashboard/SchoolAdmin/parts/grade-dialog";
import { GradeFilters } from "@modules/Dashboard/SchoolAdmin/parts/grade-filter";
import { GradeTable } from "@modules/Dashboard/SchoolAdmin/parts/grade-table";
import { PAGE_SIZE } from "@/utils/constant";
import { GradeForm } from "@modules/Dashboard/SchoolAdmin/parts/grade-form";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as API from "@/lib/redux/api";
import * as L from "lucide-react";

const SchoolAdminGradesPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editTarget, setEditTarget] = useState<TGradeDialogState>(null);

  const { data: me, isLoading: isMeLoading } = API.useSchoolAdminMeQuery();
  const schoolId = me?.schoolId ?? "";

  const skip = (page - 1) * PAGE_SIZE;

  const {
    data,
    isLoading: isGradesLoading,
    isFetching,
  } = API.useGradesQuery(
    {
      schoolId,
      take: PAGE_SIZE,
      skip,
      includeDeleted: includeArchived,
    },
    {
      skip: !schoolId,
    },
  );

  const [createGrade, { isLoading: isCreating }] = API.useCreateGradeMutation();
  const [updateGrade, { isLoading: isUpdating }] = API.useUpdateGradeMutation();
  const [archiveGrade, { isLoading: isArchiving }] =
    API.useArchiveGradeMutation();
  const [restoreGrade, { isLoading: isRestoring }] =
    API.useRestoreGradeMutation();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const activeCount = useMemo(
    () => items.filter((item) => !item.deletedAt).length,
    [items],
  );

  const archivedCount = useMemo(
    () => items.filter((item) => Boolean(item.deletedAt)).length,
    [items],
  );

  const handleCreateGrade = async (values: { name: string; code: string }) => {
    if (!schoolId) {
      toast.error(t("dashboard.schoolAdmin.grades.toasts.schoolMissing"));
      return;
    }

    try {
      await createGrade({
        schoolId,
        name: values.name.trim(),
        code: values.code.trim() || undefined,
      }).unwrap();

      toast.success(t("dashboard.schoolAdmin.grades.toasts.createSuccess"));
      setPage(1);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.grades.toasts.createFailed"),
        ),
      );
    }
  };

  const handleEditGrade = async (values: {
    id: string;
    name: string;
    code: string;
  }) => {
    try {
      await updateGrade({
        id: values.id,
        name: values.name.trim(),
        code: values.code.trim() || undefined,
      }).unwrap();
      toast.success(t("dashboard.schoolAdmin.grades.toasts.updateSuccess"));
      setEditTarget(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.grades.toasts.updateFailed"),
        ),
      );
    }
  };

  const handleToggleArchive = async (id: string, deletedAt: string | null) => {
    try {
      if (deletedAt) {
        await restoreGrade(id).unwrap();
        toast.success(t("dashboard.schoolAdmin.grades.toasts.restoreSuccess"));
      } else {
        await archiveGrade(id).unwrap();
        toast.success(t("dashboard.schoolAdmin.grades.toasts.archiveSuccess"));
      }
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.grades.toasts.statusFailed"),
        ),
      );
    }
  };

  if (isMeLoading || isGradesLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <DashboardSection
          title={t("dashboard.schoolAdmin.grades.form.title")}
          description={t("dashboard.schoolAdmin.grades.form.description")}
        >
          <GradeForm isSubmitting={isCreating} onSubmit={handleCreateGrade} />
        </DashboardSection>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardSection
            description={String(total)}
            title={t("dashboard.schoolAdmin.grades.kpis.total.title")}
          >
            <p className="text-2xl font-bold">{total}</p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.schoolAdmin.grades.kpis.active.title")}
            description={t(
              "dashboard.schoolAdmin.grades.kpis.active.description",
            )}
          >
            <p className="text-2xl font-bold">{activeCount}</p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.schoolAdmin.grades.kpis.archived.title")}
            description={t(
              "dashboard.schoolAdmin.grades.kpis.archived.description",
            )}
          >
            <p className="text-2xl font-bold">{archivedCount}</p>
          </DashboardSection>
        </div>

        <DashboardSection
          title={t("dashboard.schoolAdmin.grades.filters.title")}
          description={t("dashboard.schoolAdmin.grades.filters.description")}
        >
          <GradeFilters
            includeArchived={includeArchived}
            onIncludeArchivedChange={(value) => {
              setIncludeArchived(value);
              setPage(1);
            }}
          />
        </DashboardSection>

        {!items.length ? (
          <DashboardEmptyState
            icon={L.GraduationCap}
            title={t("dashboard.schoolAdmin.grades.empty.title")}
            description={t("dashboard.schoolAdmin.grades.empty.description")}
          />
        ) : (
          <GradeTable
            page={page}
            items={items}
            total={total}
            pageSize={PAGE_SIZE}
            isFetching={isFetching}
            isUpdating={isUpdating}
            isArchiving={isArchiving}
            isRestoring={isRestoring}
            onPageChange={setPage}
            onEdit={(grade) =>
              setEditTarget({
                id: grade.id,
                name: grade.name,
                code: grade.code ?? "",
              })
            }
            onToggleArchive={handleToggleArchive}
          />
        )}
      </div>

      <GradeEditDialog
        open={Boolean(editTarget)}
        isSubmitting={isUpdating}
        initialValues={editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        onSubmit={handleEditGrade}
      />
    </>
  );
};

export default SchoolAdminGradesPage;
