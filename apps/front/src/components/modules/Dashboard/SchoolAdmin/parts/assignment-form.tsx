"use client";

import { TAssignmentCreateFormProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const AssignmentCreateForm = ({
  form,
  isLoading,
  onSubmit,
}: TAssignmentCreateFormProps) => {
  const { t } = useI18n();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FloatingInputField
          name="title"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.title")}
        />

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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FloatingInputField
          name="description"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.description")}
        />

        <FloatingInputField
          name="dueAt"
          type="datetime-local"
          control={form.control}
          label={t("dashboard.schoolAdmin.assignments.form.fields.dueAt")}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="brand"
          disabled={isLoading}
          className="rounded-2xl"
        >
          {isLoading
            ? t("dashboard.schoolAdmin.assignments.actions.creating")
            : t("dashboard.schoolAdmin.assignments.actions.create")}
        </Button>
      </div>
    </form>
  );
};
