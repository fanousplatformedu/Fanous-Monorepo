"use client";

import { TCounselorAssignmentsFilterValues } from "@/types/modules";
import { CounselorAssignmentsAssignDialog } from "@modules/Dashboard/SchoolAdmin/parts/counselor-asignment-assign-dialog";
import { CounselorAssignmentsSummaryCards } from "@modules/Dashboard/SchoolAdmin/parts/counselor-assignments-summary-cards";
import { CounselorAssignmentsFilters } from "@modules/Dashboard/SchoolAdmin/parts/counselor-assignments-filter";
import { CounselorAssignmentsTable } from "@modules/Dashboard/SchoolAdmin/parts/counselor-assignments-table";
import { useSchoolAdminMeQuery } from "@/lib/redux/api/endpoints/school-admin.api";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as API from "@/lib/redux/api/endpoints/school-admin.api";
import * as L from "lucide-react";

const defaultFilters: TCounselorAssignmentsFilterValues = {
  query: "",
  counselorId: "ALL",
  studentId: "ALL",
  status: "ALL",
};

const SchoolAdminCounselorAssignmentsPage = () => {
  const { t } = useI18n();

  // ================= States ====================
  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TCounselorAssignmentsFilterValues>(defaultFilters);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // ================= API Hook ==================
  const skip = (page - 1) * PAGE_SIZE;
  const { data: meData } = useSchoolAdminMeQuery();
  const schoolId = meData?.schoolId ?? "";
  const { data: counselorsData, isLoading: isCounselorsLoading } =
    API.useSchoolCounselorsQuery(
      {
        schoolId,
        take: 100,
        skip: 0,
      },
      {
        skip: !schoolId,
      },
    );

  const { data: studentsData, isLoading: isStudentsLoading } =
    API.useSchoolStudentsForCounselorAssignmentQuery(
      {
        schoolId,
        take: 200,
        skip: 0,
      },
      {
        skip: !schoolId,
      },
    );

  const {
    data: assignmentsData,
    isLoading: isAssignmentsLoading,
    isFetching: isAssignmentsFetching,
  } = API.useCounselorStudentAssignmentsQuery(
    {
      schoolId,
      take: PAGE_SIZE,
      skip,
      query: filters.query.trim() || undefined,
      counselorId:
        filters.counselorId === "ALL" ? undefined : filters.counselorId,
      studentId: filters.studentId === "ALL" ? undefined : filters.studentId,
      status: filters.status === "ALL" ? undefined : filters.status,
    },
    {
      skip: !schoolId,
    },
  );

  const [assignStudentsToCounselor, { isLoading: isAssigning }] =
    API.useAssignStudentsToCounselorMutation();
  const [archiveAssignment, { isLoading: isArchiving }] =
    API.useArchiveCounselorStudentAssignmentMutation();
  const [restoreAssignment, { isLoading: isRestoring }] =
    API.useRestoreCounselorStudentAssignmentMutation();
  const counselorOptions = useMemo(() => {
    const items = counselorsData?.items ?? [];
    return items.map((item) => ({
      value: item.id,
      label: item.fullName || item.email || item.mobile || item.id,
    }));
  }, [counselorsData]);
  const studentOptions = useMemo(() => {
    const items = studentsData?.items ?? [];
    return items.map((item) => ({
      value: item.id,
      label: item.fullName || item.email || item.mobile || item.id,
    }));
  }, [studentsData]);

  // ================ Use Memo ==================
  const rows = useMemo(() => assignmentsData?.items ?? [], [assignmentsData]);
  const total = assignmentsData?.total ?? 0;
  const activeCount = useMemo(
    () => rows.filter((item) => item.status === "ACTIVE").length,
    [rows],
  );
  const archivedCount = useMemo(
    () => rows.filter((item) => item.status === "ARCHIVED").length,
    [rows],
  );
  const uniqueCounselorsCount = useMemo(
    () => new Set(rows.map((item) => item.counselorId)).size,
    [rows],
  );
  const handleAssignSubmit = async (values: {
    counselorId: string;
    studentIds: string[];
  }) => {
    if (!schoolId) return;
    try {
      const response = await assignStudentsToCounselor({
        schoolId,
        counselorId: values.counselorId,
        studentIds: values.studentIds,
      }).unwrap();
      toast.success(
        response.message ||
          t("dashboard.schoolAdmin.counselorAssignments.toasts.assignSuccess"),
      );
      setAssignDialogOpen(false);
      setPage(1);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.counselorAssignments.toasts.assignFailed"),
        ),
      );
    }
  };

  // =============== Archive Handler ==================
  const handleArchive = async (assignmentId: string) => {
    try {
      const response = await archiveAssignment({ assignmentId }).unwrap();
      toast.success(
        response.message ||
          t("dashboard.schoolAdmin.counselorAssignments.toasts.archiveSuccess"),
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.counselorAssignments.toasts.archiveFailed"),
        ),
      );
    }
  };

  // ================= Restore Handler ================
  const handleRestore = async (assignmentId: string) => {
    try {
      const response = await restoreAssignment({ assignmentId }).unwrap();
      toast.success(
        response.message ||
          t("dashboard.schoolAdmin.counselorAssignments.toasts.restoreSuccess"),
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.counselorAssignments.toasts.restoreFailed"),
        ),
      );
    }
  };

  if (
    !schoolId ||
    isCounselorsLoading ||
    isStudentsLoading ||
    isAssignmentsLoading
  )
    return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <CounselorAssignmentsSummaryCards
              total={total}
              activeCount={activeCount}
              archivedCount={archivedCount}
              counselorsCount={uniqueCounselorsCount}
            />
          </div>

          <div className="xl:w-auto">
            <Button
              type="button"
              variant="brand"
              className="w-full rounded-2xl xl:w-auto"
              onClick={() => setAssignDialogOpen(true)}
              disabled={!counselorOptions.length || !studentOptions.length}
            >
              <L.UserPlus2 className="mr-2 h-4 w-4" />
              {t(
                "dashboard.schoolAdmin.counselorAssignments.actions.assignStudents",
              )}
            </Button>
          </div>
        </div>

        <DashboardSection
          title={t(
            "dashboard.schoolAdmin.counselorAssignments.filtersCard.title",
          )}
          description={t(
            "dashboard.schoolAdmin.counselorAssignments.filtersCard.description",
          )}
        >
          <CounselorAssignmentsFilters
            value={filters}
            studentOptions={studentOptions}
            counselorOptions={counselorOptions}
            onApply={(nextValues) => {
              setPage(1);
              setFilters(nextValues);
            }}
            onReset={() => {
              setPage(1);
              setFilters(defaultFilters);
            }}
          />
        </DashboardSection>

        {!rows.length ? (
          <DashboardEmptyState
            icon={L.UsersRound}
            title={t("dashboard.schoolAdmin.counselorAssignments.empty.title")}
            description={t(
              "dashboard.schoolAdmin.counselorAssignments.empty.description",
            )}
          />
        ) : (
          <CounselorAssignmentsTable
            page={page}
            items={rows}
            total={total}
            onPageChange={setPage}
            onArchive={handleArchive}
            isArchiving={isArchiving}
            onRestore={handleRestore}
            isRestoring={isRestoring}
            isFetching={isAssignmentsFetching}
          />
        )}
      </div>

      <CounselorAssignmentsAssignDialog
        open={assignDialogOpen}
        isLoading={isAssigning}
        onSubmit={handleAssignSubmit}
        studentOptions={studentOptions}
        onOpenChange={setAssignDialogOpen}
        counselorOptions={counselorOptions}
      />
    </>
  );
};

export default SchoolAdminCounselorAssignmentsPage;
