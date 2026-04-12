"use client";

import { classroomSchema, TClassroomForm } from "@/lib/validation/school-admin";
import { useRestoreClassroomMutation } from "@/lib/redux/api";
import { useArchiveClassroomMutation } from "@/lib/redux/api";
import { useCreateClassroomMutation } from "@/lib/redux/api";
import { useUpdateClassroomMutation } from "@/lib/redux/api";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { FloatingSelectField } from "@elements/floating-select-field";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { DashboardTableCard } from "@elements/dashboard-table-card";
import { useClassroomsQuery } from "@/lib/redux/api";
import { getApiErrorMessage } from "@/utils/function-helper";
import { FloatingInputField } from "@elements/floating-input-field";
import { useMemo, useState } from "react";
import { DashboardSection } from "@elements/dashboard-section";
import { TablePagination } from "@elements/table-pagination";
import { useGradesQuery } from "@/lib/redux/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAGE_SIZE } from "@/utils/constant";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as F from "@ui/form";
import * as L from "lucide-react";

const SchoolAdminClassrooms = () => {
  const [page, setPage] = useState(1);

  const { data: gradesData } = useGradesQuery({
    take: 100,
    skip: 0,
  });

  const { data, isLoading } = useClassroomsQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const [createClassroom, { isLoading: creating }] =
    useCreateClassroomMutation();
  const [updateClassroom, { isLoading: updating }] =
    useUpdateClassroomMutation();
  const [archiveClassroom, { isLoading: archiving }] =
    useArchiveClassroomMutation();
  const [restoreClassroom, { isLoading: restoring }] =
    useRestoreClassroomMutation();

  const grades = gradesData?.items ?? [];
  const classrooms = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const form = useForm<TClassroomForm>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      gradeId: "",
      name: "",
      code: "",
      year: "",
    },
  });

  const gradeOptions = grades.map((grade) => ({
    value: grade.id,
    label: grade.name,
  }));

  const onSubmit = async (values: TClassroomForm) => {
    try {
      await createClassroom({
        gradeId: values.gradeId,
        name: values.name.trim(),
        code: values.code?.trim() || undefined,
        year: values.year ? Number(values.year) : undefined,
      }).unwrap();
      toast.success("Classroom created successfully.");
      form.reset();
      setPage(1);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create classroom."));
    }
  };

  const handleEdit = async (classroom: {
    id: string;
    name: string;
    code?: string | null;
    year?: number | null;
  }) => {
    const nextName = window.prompt("Update classroom name", classroom.name);
    const nextCode = window.prompt(
      "Update classroom code",
      classroom.code || "",
    );
    const nextYear = window.prompt(
      "Update classroom year",
      classroom.year?.toString() || "",
    );

    if (!nextName?.trim()) return;

    try {
      await updateClassroom({
        id: classroom.id,
        name: nextName.trim(),
        code: nextCode?.trim() || undefined,
        year: nextYear ? Number(nextYear) : undefined,
      }).unwrap();
      toast.success("Classroom updated successfully.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update classroom."));
    }
  };

  const handleToggleArchive = async (id: string, deletedAt?: string | null) => {
    try {
      if (deletedAt) {
        await restoreClassroom(id).unwrap();
        toast.success("Classroom restored successfully.");
      } else {
        await archiveClassroom(id).unwrap();
        toast.success("Classroom archived successfully.");
      }
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Failed to update classroom status."),
      );
    }
  };

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Create Classroom"
        description="Add classrooms under existing grades."
      >
        <F.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FloatingSelectField
                control={form.control}
                name="gradeId"
                label="Select grade"
                options={gradeOptions}
              />

              <FloatingInputField
                control={form.control}
                name="name"
                label="Classroom name"
              />

              <FloatingInputField
                control={form.control}
                name="code"
                label="Code"
              />

              <FloatingInputField
                control={form.control}
                name="year"
                label="Academic year"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="brand"
                className="rounded-2xl"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Classroom"}
              </Button>
            </div>
          </form>
        </F.Form>
      </DashboardSection>

      {isLoading ? (
        <DashboardLoadingCard rows={7} />
      ) : !classrooms.length ? (
        <DashboardEmptyState
          icon={L.School}
          title="No classrooms found"
          description="Create the first classroom for this school."
        />
      ) : (
        <DashboardTableCard
          title="Classrooms"
          description="Manage classroom records and archive states."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/30 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Grade</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {classrooms.map((classroom) => {
                  const grade = grades.find((g) => g.id === classroom.gradeId);

                  return (
                    <tr
                      key={classroom.id}
                      className="border-t border-border/40"
                    >
                      <td className="px-4 py-3">{classroom.name}</td>
                      <td className="px-4 py-3">{grade?.name || "-"}</td>
                      <td className="px-4 py-3">{classroom.code || "-"}</td>
                      <td className="px-4 py-3">{classroom.year || "-"}</td>
                      <td className="px-4 py-3">
                        {classroom.deletedAt ? "Archived" : "Active"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="brandOutline"
                            disabled={updating}
                            onClick={() => handleEdit(classroom)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="brandSoft"
                            disabled={archiving || restoring}
                            onClick={() =>
                              handleToggleArchive(
                                classroom.id,
                                classroom.deletedAt,
                              )
                            }
                          >
                            {classroom.deletedAt ? "Restore" : "Archive"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </DashboardTableCard>
      )}
    </div>
  );
};

export default SchoolAdminClassrooms;
