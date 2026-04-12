"use client";

import { useGradesQuery } from "@/lib/redux/api";
import { useCreateGradeMutation } from "@/lib/redux/api";
import { useUpdateGradeMutation } from "@/lib/redux/api";
import { useArchiveGradeMutation } from "@/lib/redux/api";
import { useRestoreGradeMutation } from "@/lib/redux/api";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { DashboardTableCard } from "@elements/dashboard-table-card";
import { DashboardSection } from "@elements/dashboard-section";
import { TablePagination } from "@elements/table-pagination";
import { FloatingInputField } from "@elements/floating-input-field";
import { getApiErrorMessage } from "@/utils/function-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";
import { z } from "zod";

import * as F from "@ui/form";
import * as L from "lucide-react";
import { PAGE_SIZE } from "@/utils/constant";

const gradeSchema = z.object({
  name: z.string().min(1, "Grade name is required"),
  code: z.string().optional(),
});

type TGradeForm = z.infer<typeof gradeSchema>;

const SchoolAdminGrades = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGradesQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const [createGrade, { isLoading: creating }] = useCreateGradeMutation();
  const [updateGrade, { isLoading: updating }] = useUpdateGradeMutation();
  const [archiveGrade, { isLoading: archiving }] = useArchiveGradeMutation();
  const [restoreGrade, { isLoading: restoring }] = useRestoreGradeMutation();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const form = useForm<TGradeForm>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const onSubmit = async (values: TGradeForm) => {
    try {
      await createGrade({
        name: values.name.trim(),
        code: values.code?.trim() || undefined,
      }).unwrap();
      toast.success("Grade created successfully.");
      form.reset();
      setPage(1);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create grade."));
    }
  };

  const handleEdit = async (grade: {
    id: string;
    name: string;
    code?: string | null;
  }) => {
    const nextName = window.prompt("Update grade name", grade.name);
    const nextCode = window.prompt("Update grade code", grade.code || "");
    if (!nextName?.trim()) return;
    try {
      await updateGrade({
        id: grade.id,
        name: nextName.trim(),
        code: nextCode?.trim() || undefined,
      }).unwrap();
      toast.success("Grade updated successfully.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update grade."));
    }
  };

  const handleToggleArchive = async (id: string, deletedAt?: string | null) => {
    try {
      if (deletedAt) {
        await restoreGrade(id).unwrap();
        toast.success("Grade restored successfully.");
      } else {
        await archiveGrade(id).unwrap();
        toast.success("Grade archived successfully.");
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update grade status."));
    }
  };

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Create Grade"
        description="Create and manage academic grade levels."
      >
        <F.Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-[1fr_220px_180px]"
          >
            <FloatingInputField
              control={form.control}
              name="name"
              label="Grade name"
            />
            <FloatingInputField
              control={form.control}
              name="code"
              label="Code"
            />
            <Button
              type="submit"
              variant="brand"
              className="h-14 rounded-2xl"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Grade"}
            </Button>
          </form>
        </F.Form>
      </DashboardSection>

      {isLoading ? (
        <DashboardLoadingCard rows={7} />
      ) : !items.length ? (
        <DashboardEmptyState
          icon={L.GraduationCap}
          title="No grades found"
          description="Create the first grade for this school."
        />
      ) : (
        <DashboardTableCard
          title="Grades"
          description="Manage school grade levels."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/30 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((grade) => (
                  <tr key={grade.id} className="border-t border-border/40">
                    <td className="px-4 py-3">{grade.name}</td>
                    <td className="px-4 py-3">{grade.code || "-"}</td>
                    <td className="px-4 py-3">
                      {grade.deletedAt ? "Archived" : "Active"}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(grade.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="brandOutline"
                          size="sm"
                          disabled={updating}
                          onClick={() => handleEdit(grade)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="brandSoft"
                          size="sm"
                          disabled={archiving || restoring}
                          onClick={() =>
                            handleToggleArchive(grade.id, grade.deletedAt)
                          }
                        >
                          {grade.deletedAt ? "Restore" : "Archive"}
                        </Button>
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
        </DashboardTableCard>
      )}
    </div>
  );
};

export default SchoolAdminGrades;
