"use client";

import { TDialogMode, TSelectedAssignment } from "@/types/modules";
import { createAssignmentSchema } from "@/lib/validation/school-admin-schemas";
import { toIsoFromLocalDateTime } from "@/utils/function-helper";
import { AssignmentSummaryCards } from "@modules/Dashboard/SchoolAdmin/parts/assignment-card";
import { AssignmentResultsTable } from "@modules/Dashboard/SchoolAdmin/parts/assignment-table";
import { AssignmentActionDialog } from "@modules/Dashboard/SchoolAdmin/parts/assignment-dialog";
import { TCreateAssignmentForm } from "@/lib/validation/school-admin-schemas";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { AssignmentCreateForm } from "@modules/Dashboard/SchoolAdmin/parts/assignment-form";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { TablePagination } from "@elements/table-pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAGE_SIZE } from "@/utils/constant";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as API from "@/lib/redux/api";
import * as L from "lucide-react";
import * as F from "@ui/form";

const SchoolAdminAssignmentsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [resultsPage, setResultsPage] = useState(1);

  const [dialogMode, setDialogMode] = useState<TDialogMode>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<TSelectedAssignment | null>(null);

  const { data: questions, isLoading: isQuestionsLoading } =
    API.useAssessmentQuestionsQuery();

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
  } = API.useSchoolAssessmentSummaryQuery({});

  const {
    data: assignmentsData,
    isLoading: isAssignmentsLoading,
    isFetching: isAssignmentsFetching,
  } = API.useAssignmentsQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const {
    data: resultsData,
    isLoading: isResultsLoading,
    isFetching: isResultsFetching,
  } = API.useAssessmentResultsQuery({
    take: PAGE_SIZE,
    skip: (resultsPage - 1) * PAGE_SIZE,
  });

  const [createAssignment, { isLoading: isCreating }] =
    API.useCreateAssignmentMutation();

  const [publishAssignment, { isLoading: isPublishing }] =
    API.usePublishAssignmentMutation();

  const [assignAssignment, { isLoading: isAssigning }] =
    API.useAssignAssignmentToStudentsMutation();

  const form = useForm<TCreateAssignmentForm>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      dueAt: "",
      description: "",
      targetMode: "ALL_STUDENTS",
    },
  });

  const assignmentList = useMemo(
    () => assignmentsData?.items ?? [],
    [assignmentsData],
  );

  const assignmentsTotal = assignmentsData?.total ?? 0;
  const questionCount = questions?.length ?? 0;

  const resultItems = useMemo(() => resultsData?.items ?? [], [resultsData]);
  const resultsTotal = resultsData?.total ?? 0;

  const onSubmit = async (values: TCreateAssignmentForm) => {
    try {
      await createAssignment({
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        dueAt: toIsoFromLocalDateTime(values.dueAt),
        targetMode: values.targetMode,
      }).unwrap();
      toast.success(
        t("dashboard.schoolAdmin.assignments.toasts.createSuccess"),
      );
      form.reset({
        title: "",
        description: "",
        dueAt: "",
        targetMode: "ALL_STUDENTS",
      });
      setPage(1);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.assignments.toasts.createFailed"),
        ),
      );
    }
  };

  const openPublishDialog = (assignment: TSelectedAssignment) => {
    setSelectedAssignment(assignment);
    setDialogMode("publish");
  };

  const openAssignDialog = (assignment: TSelectedAssignment) => {
    setSelectedAssignment(assignment);
    setDialogMode("assign");
  };

  const closeDialog = (open: boolean) => {
    if (!open) {
      setDialogMode(null);
      setSelectedAssignment(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedAssignment || !dialogMode) return;
    try {
      if (dialogMode === "publish") {
        await publishAssignment(selectedAssignment.id).unwrap();
        toast.success(
          t("dashboard.schoolAdmin.assignments.toasts.publishSuccess"),
        );
      } else {
        const response = await assignAssignment({
          assignmentId: selectedAssignment.id,
        }).unwrap();
        toast.success(
          typeof response === "string"
            ? response
            : t("dashboard.schoolAdmin.assignments.toasts.assignSuccess"),
        );
      }
      setDialogMode(null);
      setSelectedAssignment(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          dialogMode === "publish"
            ? t("dashboard.schoolAdmin.assignments.toasts.publishFailed")
            : t("dashboard.schoolAdmin.assignments.toasts.assignFailed"),
        ),
      );
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`dashboard.schoolAdmin.assignments.status.${status}`);
  };

  const getTargetModeLabel = (targetMode: string) => {
    return t(`dashboard.schoolAdmin.assignments.targetMode.${targetMode}`);
  };

  return (
    <>
      <div className="space-y-6">
        {isSummaryLoading ? (
          <DashboardLoadingCard rows={3} />
        ) : (
          <AssignmentSummaryCards
            summary={summary}
            questionCount={questionCount}
            isFetching={isSummaryFetching}
          />
        )}

        <DashboardSection
          title={t("dashboard.schoolAdmin.assignments.form.title")}
          description={t("dashboard.schoolAdmin.assignments.form.description", {
            count: String(questionCount),
          })}
        >
          <F.Form {...form}>
            <AssignmentCreateForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isCreating}
            />
          </F.Form>
        </DashboardSection>

        {isAssignmentsLoading || isQuestionsLoading ? (
          <DashboardLoadingCard rows={8} />
        ) : !assignmentList.length ? (
          <DashboardEmptyState
            icon={L.FileText}
            title={t("dashboard.schoolAdmin.assignments.empty.title")}
            description={t(
              "dashboard.schoolAdmin.assignments.empty.description",
            )}
          />
        ) : (
          <DashboardTableCard
            title={t("dashboard.schoolAdmin.assignments.table.title")}
            description={t(
              "dashboard.schoolAdmin.assignments.table.description",
            )}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-secondary/30 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.assignments.table.columns.title",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.assignments.table.columns.status",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.assignments.table.columns.target",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.schoolAdmin.assignments.table.columns.due")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.assignments.table.columns.published",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      {t(
                        "dashboard.schoolAdmin.assignments.table.columns.actions",
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignmentList.map((item) => (
                    <tr key={item.id} className="border-t border-border/40">
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            item.status === "PUBLISHED"
                              ? "inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                              : item.status === "DRAFT"
                                ? "inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
                                : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {getTargetModeLabel(item.targetMode)}
                      </td>

                      <td className="px-4 py-3">
                        {item.dueAt
                          ? new Date(item.dueAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3">
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {item.status === "DRAFT" ? (
                            <Button
                              variant="brandChip"
                              className="rounded-2xl"
                              disabled={isPublishing}
                              onClick={() =>
                                openPublishDialog({
                                  id: item.id,
                                  title: item.title,
                                  status: item.status,
                                })
                              }
                            >
                              {t(
                                "dashboard.schoolAdmin.assignments.actions.publish",
                              )}
                            </Button>
                          ) : null}

                          {item.status === "PUBLISHED" ? (
                            <Button
                              variant="brand"
                              disabled={isAssigning}
                              className="rounded-2xl"
                              onClick={() =>
                                openAssignDialog({
                                  id: item.id,
                                  title: item.title,
                                  status: item.status,
                                })
                              }
                            >
                              {t(
                                "dashboard.schoolAdmin.assignments.actions.assign",
                              )}
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              total={assignmentsTotal}
            />

            {isAssignmentsFetching ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {t("common.refreshing")}
              </p>
            ) : null}
          </DashboardTableCard>
        )}

        <AssignmentResultsTable
          page={resultsPage}
          items={resultItems}
          total={resultsTotal}
          onPageChange={setResultsPage}
          isLoading={isResultsLoading}
          isFetching={isResultsFetching}
        />
      </div>

      <AssignmentActionDialog
        mode={dialogMode}
        onOpenChange={closeDialog}
        assignment={selectedAssignment}
        onConfirm={handleConfirmAction}
        isLoading={isPublishing || isAssigning}
        open={Boolean(dialogMode && selectedAssignment)}
      />
    </>
  );
};

export default SchoolAdminAssignmentsPage;
