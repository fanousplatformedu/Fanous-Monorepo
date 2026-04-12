"use client";

import { useAssignAssignmentToStudentsMutation } from "@/lib/redux/api";
import { usePublishAssignmentMutation } from "@/lib/redux/api";
import { useAssessmentQuestionsQuery } from "@/lib/redux/api";
import { useCreateAssignmentMutation } from "@/lib/redux/api";
import { createAssignmentSchema } from "@/lib/validation/school-admin";
import { TCreateAssignmentForm } from "@/lib/validation/school-admin";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { useAssignmentsQuery } from "@/lib/redux/api";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { DashboardTableCard } from "@elements/dashboard-table-card";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@elements/dashboard-section";
import { TablePagination } from "@elements/table-pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAGE_SIZE } from "@/utils/constant";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as F from "@ui/form";
import * as L from "lucide-react";

const SchoolAdminAssignments = () => {
  const [page, setPage] = useState(1);

  const { data: questions } = useAssessmentQuestionsQuery();
  const { data, isLoading, isFetching } = useAssignmentsQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const [createAssignment, { isLoading: isCreating }] =
    useCreateAssignmentMutation();
  const [publishAssignment, { isLoading: isPublishing }] =
    usePublishAssignmentMutation();
  const [assignAssignment, { isLoading: isAssigning }] =
    useAssignAssignmentToStudentsMutation();

  const form = useForm<TCreateAssignmentForm>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueAt: "",
      targetMode: "ALL_STUDENTS",
    },
  });

  const assignmentList = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;
  const questionCount = questions?.length ?? 0;

  const onSubmit = async (values: TCreateAssignmentForm) => {
    try {
      await createAssignment({
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        dueAt: values.dueAt || undefined,
        targetMode: values.targetMode,
      }).unwrap();
      toast.success("Assignment created successfully.");
      form.reset();
      setPage(1);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create assignment."));
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishAssignment(id).unwrap();
      toast.success("Assignment published successfully.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to publish assignment."));
    }
  };

  const handleAssign = async (assignmentId: string) => {
    try {
      const res = await assignAssignment({
        assignmentId,
      }).unwrap();
      toast.success(
        typeof res === "string"
          ? `Assignment dispatched: ${res}`
          : "Assignment assigned successfully.",
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Failed to assign assessment to students."),
      );
    }
  };

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Create Assignment"
        description={`Create, publish, and dispatch assessment assignments. Active questions: ${questionCount}`}
      >
        <F.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FloatingInputField
                control={form.control}
                name="title"
                label="Assignment title"
              />

              <FloatingSelectField
                control={form.control}
                name="targetMode"
                label="Target mode"
                options={[
                  { value: "ALL_STUDENTS", label: "All students" },
                  { value: "BY_GRADE", label: "By grade" },
                  { value: "BY_CLASSROOM", label: "By classroom" },
                  { value: "BY_STUDENT_IDS", label: "Specific students" },
                ]}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FloatingInputField
                control={form.control}
                name="description"
                label="Description"
              />

              <FloatingInputField
                control={form.control}
                name="dueAt"
                label="Due date"
                type="datetime-local"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="brand"
                className="rounded-2xl"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Assignment"}
              </Button>
            </div>
          </form>
        </F.Form>
      </DashboardSection>

      {isLoading ? (
        <DashboardLoadingCard rows={8} />
      ) : !assignmentList.length ? (
        <DashboardEmptyState
          icon={L.FileText}
          title="No assignments found"
          description="Create your first assessment assignment to get started."
        />
      ) : (
        <DashboardTableCard
          title="Assignments"
          description="Manage created assignments and dispatch them to students."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/30 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3 font-medium">Published</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
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
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">{item.targetMode}</td>
                    <td className="px-4 py-3">
                      {item.dueAt ? new Date(item.dueAt).toLocaleString() : "-"}
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
                            size="sm"
                            variant="brandOutline"
                            disabled={isPublishing}
                            onClick={() => handlePublish(item.id)}
                          >
                            Publish
                          </Button>
                        ) : null}

                        {item.status === "PUBLISHED" ? (
                          <Button
                            size="sm"
                            variant="brand"
                            disabled={isAssigning}
                            onClick={() => handleAssign(item.id)}
                          >
                            Assign
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
            total={total}
            onPageChange={setPage}
          />

          {isFetching ? (
            <p className="mt-3 text-xs text-muted-foreground">Refreshing...</p>
          ) : null}
        </DashboardTableCard>
      )}
    </div>
  );
};

export default SchoolAdminAssignments;
