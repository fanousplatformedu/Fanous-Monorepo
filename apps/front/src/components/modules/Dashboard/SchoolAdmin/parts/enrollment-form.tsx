"use client";

import { TEnrollmentFormProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const EnrollmentForm = ({
  form,
  disabled,
  onSubmit,
  isSubmitting,
  studentOptions,
  duplicateMessage,
  classroomOptions,
  selectedStudentAlreadyActive,
}: TEnrollmentFormProps) => {
  const { t } = useI18n();

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 my-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_180px]">
          <FloatingSelectField
            name="classroomId"
            control={form.control}
            options={classroomOptions}
            label={t("dashboard.schoolAdmin.enrollments.form.classroom")}
          />

          <FloatingSelectField
            name="studentId"
            control={form.control}
            options={studentOptions}
            label={t("dashboard.schoolAdmin.enrollments.form.student")}
          />

          <Button
            type="submit"
            variant="brand"
            className="h-14 rounded-2xl"
            disabled={isSubmitting || disabled}
          >
            {isSubmitting
              ? t("dashboard.schoolAdmin.enrollments.actions.enrolling")
              : t("dashboard.schoolAdmin.enrollments.actions.enroll")}
          </Button>
        </div>

        {selectedStudentAlreadyActive ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            {duplicateMessage}
          </div>
        ) : null}
      </form>
    </F.Form>
  );
};
