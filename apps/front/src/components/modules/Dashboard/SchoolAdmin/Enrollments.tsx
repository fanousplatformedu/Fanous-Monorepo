"use client";

import { useEnrollmentsByClassroomQuery } from "@/lib/redux/api";
import { useCloseEnrollmentMutation } from "@/lib/redux/api";
import { useEnrollStudentMutation } from "@/lib/redux/api";
import { useSchoolMembersQuery } from "@/lib/redux/api";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { FloatingSelectField } from "@elements/floating-select-field";
import { DashboardTableCard } from "@elements/dashboard-table-card";
import { useClassroomsQuery } from "@/lib/redux/api";
import { getApiErrorMessage } from "@/utils/function-helper";
import { DashboardSection } from "@elements/dashboard-section";
import { enrollmentSchema } from "@/lib/validation/school-admin";
import { TEnrollmentForm } from "@/lib/validation/school-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as F from "@ui/form";
import * as L from "lucide-react";

const SchoolAdminEnrollments = () => {
  const { data: classroomsData } = useClassroomsQuery({
    take: 100,
    skip: 0,
  });

  const { data: membersData } = useSchoolMembersQuery({
    take: 200,
    skip: 0,
  });

  const [enrollStudent, { isLoading: enrolling }] = useEnrollStudentMutation();
  const [closeEnrollment, { isLoading: closing }] =
    useCloseEnrollmentMutation();

  const classrooms =
    classroomsData?.items?.filter((item) => !item.deletedAt) ?? [];

  const students =
    membersData?.items?.filter((item) => item.role === "STUDENT") ?? [];

  const form = useForm<TEnrollmentForm>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      classroomId: "",
      studentId: "",
    },
  });

  const selectedClassroomId = form.watch("classroomId");

  const { data: enrollmentsData, isFetching } = useEnrollmentsByClassroomQuery(
    {
      schoolId: "",
      classroomId: selectedClassroomId,
    },
    {
      skip: !selectedClassroomId,
    },
  );

  const enrollments = useMemo(() => enrollmentsData ?? [], [enrollmentsData]);

  const classroomOptions = classrooms.map((classroom) => ({
    value: classroom.id,
    label: classroom.name,
  }));

  const studentOptions = students.map((student) => ({
    value: student.id,
    label: student.fullName || student.email || student.mobile || student.id,
  }));

  const onSubmit = async (values: TEnrollmentForm) => {
    try {
      await enrollStudent({
        classroomId: values.classroomId,
        studentId: values.studentId,
      }).unwrap();
      toast.success("Student enrolled successfully.");
      form.reset({
        classroomId: values.classroomId,
        studentId: "",
      });
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to enroll student."));
    }
  };

  const handleCloseEnrollment = async (id: string) => {
    try {
      await closeEnrollment({ id }).unwrap();
      toast.success("Enrollment closed successfully.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to close enrollment."));
    }
  };

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Enrollment Management"
        description="Assign students to classrooms and manage enrollment records."
      >
        <F.Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-[1fr_1fr_180px]"
          >
            <FloatingSelectField
              control={form.control}
              name="classroomId"
              label="Select classroom"
              options={classroomOptions}
            />

            <FloatingSelectField
              control={form.control}
              name="studentId"
              label="Select student"
              options={studentOptions}
            />

            <Button
              type="submit"
              variant="brand"
              className="h-14 rounded-2xl"
              disabled={enrolling}
            >
              {enrolling ? "Enrolling..." : "Enroll Student"}
            </Button>
          </form>
        </F.Form>
      </DashboardSection>

      {!selectedClassroomId ? (
        <DashboardEmptyState
          icon={L.ClipboardList}
          title="Select a classroom"
          description="Choose a classroom to view its enrollment records."
        />
      ) : !enrollments.length && !isFetching ? (
        <DashboardEmptyState
          icon={L.ClipboardList}
          title="No enrollments found"
          description="This classroom has no enrollment records yet."
        />
      ) : (
        <DashboardTableCard
          title="Enrollments"
          description="Enrollment history for the selected classroom."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/30 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Student ID</th>
                  <th className="px-4 py-3 font-medium">Started</th>
                  <th className="px-4 py-3 font-medium">Ended</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((item) => (
                  <tr key={item.id} className="border-t border-border/40">
                    <td className="px-4 py-3">{item.studentId}</td>
                    <td className="px-4 py-3">
                      {new Date(item.startedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {item.endedAt
                        ? new Date(item.endedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {item.endedAt ? "Closed" : "Active"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        {!item.endedAt ? (
                          <Button
                            size="sm"
                            variant="brandOutline"
                            disabled={closing}
                            onClick={() => handleCloseEnrollment(item.id)}
                          >
                            Close
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardTableCard>
      )}
    </div>
  );
};

export default SchoolAdminEnrollments;
