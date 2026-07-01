"use client";

import {
  SearchableMultiSelectField,
  SearchableSingleSelectField,
} from "@elements/searchable-select-field";
import { TAssignmentCreateFormProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const AssignmentCreateForm = ({
  form,
  isLoading,
  onSubmit,
  gradeOptions,
  classroomOptions,
  studentOptions,
  submitLabel,
  submitLoadingLabel,
  hideSubmit = false,
}: TAssignmentCreateFormProps) => {
  const { t } = useI18n();

  const targetMode = form.watch("targetMode");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Row 1: title + description */}
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

      {/* Row 2: due date */}
      <div className="grid gap-4 md:grid-cols-2">
        <FloatingInputField
          name="dueAt"
          type="datetime-local"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.dueAt")}
        />
      </div>

      {/* Row 3: target mode + conditional picker — always on the same line */}
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

      {!hideSubmit ? (
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            variant="brand"
            disabled={isLoading}
            className="rounded-2xl"
          >
            {isLoading
              ? (submitLoadingLabel ??
                t("dashboard.schoolAdmin.assignments.actions.creating"))
              : (submitLabel ??
                t("dashboard.schoolAdmin.assignments.actions.create"))}
          </Button>
        </div>
      ) : null}
    </form>
  );
};
