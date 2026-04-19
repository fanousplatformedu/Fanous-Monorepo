"use client";

import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { EnrollmentFilters } from "@modules/Dashboard/SchoolAdmin/parts/enrollment-filter";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { enrollmentSchema } from "@/lib/validation/school-admin";
import { EnrollmentDialog } from "@modules/Dashboard/SchoolAdmin/parts/enrollment-dialog";
import { EnrollmentStats } from "@modules/Dashboard/SchoolAdmin/parts/enrollment-stats";
import { TEnrollmentForm } from "@/lib/validation/school-admin";
import { EnrollmentTable } from "@modules/Dashboard/SchoolAdmin/parts/enrollment-table";
import { EnrollmentForm } from "@modules/Dashboard/SchoolAdmin/parts/enrollment-form";
import { TCloseTarget } from "@/types/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAGE_SIZE } from "@/utils/constant";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as T from "@/lib/redux/api";
import * as L from "lucide-react";

const SchoolAdminEnrollmentsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [gradeFilter, setGradeFilter] = useState("");
  const [studentSearchInput, setStudentSearchInput] = useState("");
  const [appliedStudentSearch, setAppliedStudentSearch] = useState("");
  const [closeTarget, setCloseTarget] = useState<TCloseTarget | null>(null);

  const { data: me, isLoading: isMeLoading } = T.useSchoolAdminMeQuery();
  const schoolId = me?.schoolId ?? "";

  const form = useForm<TEnrollmentForm>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      classroomId: "",
      studentId: "",
    },
  });

  const selectedClassroomId = form.watch("classroomId");
  const selectedStudentId = form.watch("studentId");

  const { data: gradesData, isLoading: isGradesLoading } = T.useGradesQuery(
    {
      schoolId,
      take: 100,
      skip: 0,
      includeDeleted: false,
    },
    { skip: !schoolId },
  );

  const {
    data: classroomsData,
    isLoading: isClassroomsLoading,
    isFetching: isClassroomsFetching,
  } = T.useClassroomsQuery(
    {
      schoolId,
      take: 200,
      skip: 0,
      includeDeleted: false,
      gradeId: gradeFilter || undefined,
    },
    { skip: !schoolId },
  );

  const { data: allStudentsData, isLoading: isAllStudentsLoading } =
    T.useSchoolMembersQuery(
      {
        take: 500,
        skip: 0,
        role: "STUDENT",
      },
      { skip: !schoolId },
    );

  const {
    data: searchableStudentsData,
    isLoading: isSearchStudentsLoading,
    isFetching: isSearchStudentsFetching,
  } = T.useSchoolMembersQuery(
    {
      take: 500,
      skip: 0,
      role: "STUDENT",
      query: appliedStudentSearch.trim() || undefined,
    },
    { skip: !schoolId },
  );

  const skip = (page - 1) * PAGE_SIZE;

  const {
    data: enrollmentsData,
    isLoading: isEnrollmentsLoading,
    isFetching: isEnrollmentsFetching,
    refetch: refetchEnrollments,
  } = T.useEnrollmentsByClassroomQuery(
    {
      schoolId,
      classroomId: selectedClassroomId,
      take: PAGE_SIZE,
      skip,
    },
    {
      skip: !schoolId || !selectedClassroomId,
    },
  );

  const [enrollStudent, { isLoading: isEnrolling }] =
    T.useEnrollStudentMutation();

  const [closeEnrollment, { isLoading: isClosing }] =
    T.useCloseEnrollmentMutation();

  const grades = useMemo(
    () => gradesData?.items?.filter((item) => !item.deletedAt) ?? [],
    [gradesData],
  );

  const classrooms = useMemo(
    () => classroomsData?.items?.filter((item) => !item.deletedAt) ?? [],
    [classroomsData],
  );

  const allStudents = useMemo(
    () =>
      allStudentsData?.items?.filter((item) => item.role === "STUDENT") ?? [],
    [allStudentsData],
  );

  const searchableStudents = useMemo(
    () =>
      searchableStudentsData?.items?.filter(
        (item) => item.role === "STUDENT",
      ) ?? [],
    [searchableStudentsData],
  );

  const enrollments = useMemo(
    () => enrollmentsData?.items ?? [],
    [enrollmentsData],
  );

  const enrollmentsTotal = enrollmentsData?.total ?? 0;

  const gradeMap = useMemo(
    () =>
      new Map(
        grades.map((grade) => [
          grade.id,
          { name: grade.name, code: grade.code },
        ]),
      ),
    [grades],
  );

  const classroomMap = useMemo(
    () =>
      new Map(
        classrooms.map((classroom) => [
          classroom.id,
          {
            name: classroom.name,
            code: classroom.code,
            year: classroom.year,
            gradeId: classroom.gradeId,
          },
        ]),
      ),
    [classrooms],
  );

  const studentMap = useMemo(
    () =>
      new Map(
        allStudents.map((student) => [
          student.id,
          {
            fullName: student.fullName,
            email: student.email,
            mobile: student.mobile,
            status: student.status,
          },
        ]),
      ),
    [allStudents],
  );

  const selectedClassroom = useMemo(
    () => classrooms.find((item) => item.id === selectedClassroomId),
    [classrooms, selectedClassroomId],
  );

  const selectedClassroomGrade = useMemo(() => {
    if (!selectedClassroom) return null;
    return gradeMap.get(selectedClassroom.gradeId) ?? null;
  }, [selectedClassroom, gradeMap]);

  const activeEnrollmentStudentIds = useMemo(
    () =>
      new Set(
        enrollments
          .filter((item) => !item.endedAt)
          .map((item) => item.studentId),
      ),
    [enrollments],
  );

  const gradeOptions = useMemo(
    () =>
      grades.map((grade) => ({
        value: grade.id,
        label: grade.code ? `${grade.name} (${grade.code})` : grade.name,
      })),
    [grades],
  );

  const classroomOptions = useMemo(
    () =>
      classrooms.map((classroom) => {
        const grade = gradeMap.get(classroom.gradeId);
        const gradeName = grade?.name ?? "-";
        const yearLabel = classroom.year ? ` • ${classroom.year}` : "";
        const codeLabel = classroom.code ? ` • ${classroom.code}` : "";
        return {
          value: classroom.id,
          label: `${gradeName} / ${classroom.name}${yearLabel}${codeLabel}`,
        };
      }),
    [classrooms, gradeMap],
  );

  const studentOptions = useMemo(
    () =>
      searchableStudents
        .filter((student) => !activeEnrollmentStudentIds.has(student.id))
        .map((student) => ({
          value: student.id,
          label:
            student.fullName || student.email || student.mobile || student.id,
        })),
    [searchableStudents, activeEnrollmentStudentIds],
  );

  const selectedStudentAlreadyActive = useMemo(
    () =>
      selectedStudentId
        ? activeEnrollmentStudentIds.has(selectedStudentId)
        : false,
    [selectedStudentId, activeEnrollmentStudentIds],
  );

  const activeCount = useMemo(
    () => enrollments.filter((item) => !item.endedAt).length,
    [enrollments],
  );

  const closedCount = useMemo(
    () => enrollments.filter((item) => Boolean(item.endedAt)).length,
    [enrollments],
  );

  const handleApplyFilters = (values: {
    gradeFilter: string;
    studentSearch: string;
  }) => {
    setGradeFilter(values.gradeFilter);
    setStudentSearchInput(values.studentSearch);
    setAppliedStudentSearch(values.studentSearch.trim());
    form.setValue("studentId", "");
    form.setValue("classroomId", "");
    setPage(1);
  };

  const handleResetFilters = () => {
    setGradeFilter("");
    setStudentSearchInput("");
    setAppliedStudentSearch("");
    form.setValue("studentId", "");
    form.setValue("classroomId", "");
    setPage(1);
  };

  const handleSubmit = async (values: TEnrollmentForm) => {
    if (!schoolId) {
      toast.error(t("dashboard.schoolAdmin.enrollments.toasts.schoolMissing"));
      return;
    }
    if (activeEnrollmentStudentIds.has(values.studentId)) {
      toast.error(
        t("dashboard.schoolAdmin.enrollments.toasts.duplicateActive"),
      );
      return;
    }
    try {
      await enrollStudent({
        schoolId,
        classroomId: values.classroomId,
        studentId: values.studentId,
      }).unwrap();
      await refetchEnrollments();
      toast.success(
        t("dashboard.schoolAdmin.enrollments.toasts.enrollSuccess"),
      );
      form.reset({
        classroomId: values.classroomId,
        studentId: "",
      });
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.enrollments.toasts.enrollFailed"),
        ),
      );
    }
  };

  const handleConfirmClose = async () => {
    if (!closeTarget) return;
    try {
      await closeEnrollment({ id: closeTarget.id }).unwrap();
      await refetchEnrollments();
      toast.success(t("dashboard.schoolAdmin.enrollments.toasts.closeSuccess"));
      setCloseTarget(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.enrollments.toasts.closeFailed"),
        ),
      );
    }
  };

  if (
    isMeLoading ||
    isGradesLoading ||
    isClassroomsLoading ||
    isAllStudentsLoading ||
    isSearchStudentsLoading
  ) {
    return <DashboardLoadingCard rows={8} />;
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardSection
          title={t("dashboard.schoolAdmin.enrollments.form.title")}
          description={t("dashboard.schoolAdmin.enrollments.form.description")}
        >
          <EnrollmentFilters
            gradeFilter={gradeFilter}
            gradeOptions={gradeOptions}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
            studentSearch={studentSearchInput}
            isSearching={isSearchStudentsFetching}
          />

          <EnrollmentForm
            form={form}
            isSubmitting={isEnrolling}
            studentOptions={studentOptions}
            classroomOptions={classroomOptions}
            disabled={
              !schoolId ||
              !selectedClassroomId ||
              !selectedStudentId ||
              selectedStudentAlreadyActive
            }
            selectedStudentAlreadyActive={selectedStudentAlreadyActive}
            duplicateMessage={t(
              "dashboard.schoolAdmin.enrollments.messages.duplicateActive",
            )}
            onSubmit={handleSubmit}
          />

          <EnrollmentStats
            studentsCount={allStudents.length}
            classroomsCount={classrooms.length}
            selectedClassroomName={
              selectedClassroom?.name ||
              t("dashboard.schoolAdmin.enrollments.common.notSelected")
            }
          />
        </DashboardSection>

        {!selectedClassroomId ? (
          <DashboardEmptyState
            icon={L.ClipboardList}
            title={t(
              "dashboard.schoolAdmin.enrollments.empty.selectClassroom.title",
            )}
            description={t(
              "dashboard.schoolAdmin.enrollments.empty.selectClassroom.description",
            )}
          />
        ) : isEnrollmentsLoading ? (
          <DashboardLoadingCard rows={6} />
        ) : !enrollments.length && !isEnrollmentsFetching ? (
          <DashboardEmptyState
            icon={L.ClipboardList}
            title={t("dashboard.schoolAdmin.enrollments.empty.noData.title")}
            description={t(
              "dashboard.schoolAdmin.enrollments.empty.noData.description",
            )}
          />
        ) : (
          <EnrollmentTable
            page={page}
            gradeMap={gradeMap}
            isClosing={isClosing}
            onPageChange={setPage}
            studentMap={studentMap}
            closedCount={closedCount}
            activeCount={activeCount}
            enrollments={enrollments}
            classroomMap={classroomMap}
            onCloseRequest={setCloseTarget}
            isFetching={isEnrollmentsFetching}
            enrollmentsTotal={enrollmentsTotal}
            selectedClassroomName={selectedClassroom?.name || "-"}
            selectedGradeName={selectedClassroomGrade?.name || ""}
            selectedYearLabel={
              selectedClassroom?.year ? String(selectedClassroom.year) : ""
            }
          />
        )}

        {(isClassroomsFetching || isSearchStudentsFetching) && !isMeLoading ? (
          <p className="text-xs text-muted-foreground">
            {t("common.refreshing", {}, "Refreshing...")}
          </p>
        ) : null}
      </div>

      <EnrollmentDialog
        target={closeTarget}
        isLoading={isClosing}
        open={Boolean(closeTarget)}
        onConfirm={handleConfirmClose}
        onOpenChange={(open) => {
          if (!open) setCloseTarget(null);
        }}
      />
    </>
  );
};

export default SchoolAdminEnrollmentsPage;
