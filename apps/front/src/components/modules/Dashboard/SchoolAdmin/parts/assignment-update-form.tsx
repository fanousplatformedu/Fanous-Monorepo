"use client";

import {
  SearchableMultiSelectField,
  SearchableSingleSelectField,
} from "@elements/searchable-select-field";
import { TAssignmentUpdateFormProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useI18n } from "@/hooks/useI18n";

const STATUS_OPTIONS = [
  { value: "DRAFT", labelKey: "DRAFT" },
  { value: "PUBLISHED", labelKey: "PUBLISHED" },
  { value: "CLOSED", labelKey: "CLOSED" },
] as const;

export const AssignmentUpdateForm = ({
  form,
  onSubmit,
  gradeOptions,
  classroomOptions,
  studentOptions,
  statusOnly = false,
}: TAssignmentUpdateFormProps) => {
  const { t } = useI18n();
  const targetMode = form.watch("targetMode");

  const statusField = (
    <FloatingSelectField
      name="status"
      control={form.control}
      label={t("dashboard.schoolAdmin.assignments.form.fields.status")}
      options={STATUS_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`dashboard.schoolAdmin.assignments.status.${option.labelKey}`),
      }))}
    />
  );

  if (statusOnly) {
    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {statusField}
      </form>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FloatingInputField
          name="title"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.title")}
        />
        <FloatingInputField
          name="description"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.description")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FloatingInputField
          name="dueAt"
          type="datetime-local"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.dueAt")}
        />
        {statusField}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FloatingSelectField
          name="targetMode"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.targetMode")}
          options={[
            {
              value: "ALL_STUDENTS",
              label: t(
                "dashboard.schoolAdmin.assignments.targetMode.ALL_STUDENTS",
              ),
            },
            {
              value: "BY_GRADE",
              label: t("dashboard.schoolAdmin.assignments.targetMode.BY_GRADE"),
            },
            {
              value: "BY_CLASSROOM",
              label: t(
                "dashboard.schoolAdmin.assignments.targetMode.BY_CLASSROOM",
              ),
            },
            {
              value: "BY_STUDENT_IDS",
              label: t(
                "dashboard.schoolAdmin.assignments.targetMode.BY_STUDENT_IDS",
              ),
            },
          ]}
        />

        {targetMode === "BY_GRADE" ? (
          <SearchableSingleSelectField
            name="targetGradeId"
            control={form.control}
            label={t(
              "dashboard.schoolAdmin.assignments.form.fields.targetGrade",
            )}
            options={gradeOptions}
          />
        ) : targetMode === "BY_CLASSROOM" ? (
          <SearchableSingleSelectField
            name="targetClassroomId"
            control={form.control}
            label={t(
              "dashboard.schoolAdmin.assignments.form.fields.targetClassroom",
            )}
            options={classroomOptions}
          />
        ) : targetMode === "BY_STUDENT_IDS" ? (
          <SearchableMultiSelectField
            name="targetStudentIds"
            control={form.control}
            label={t(
              "dashboard.schoolAdmin.assignments.form.fields.targetStudents",
            )}
            options={studentOptions}
          />
        ) : null}
      </div>
    </form>
  );
};
