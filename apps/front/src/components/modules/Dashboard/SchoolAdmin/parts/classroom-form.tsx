"use client";

import { classroomSchema, TClassroomForm } from "@/lib/validation/school-admin";
import { TClassroomCreateFormProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ClassroomCreateForm = ({
  gradeOptions,
  isSubmitting,
  onSubmit,
}: TClassroomCreateFormProps) => {
  const { t } = useI18n();

  const form = useForm<TClassroomForm>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      gradeId: "",
      name: "",
      code: "",
      year: "",
    },
  });

  const handleSubmit = async (values: TClassroomForm) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FloatingSelectField
            name="gradeId"
            options={gradeOptions}
            control={form.control}
            label={t("dashboard.schoolAdmin.classrooms.form.grade")}
          />

          <FloatingInputField
            name="name"
            control={form.control}
            label={t("dashboard.schoolAdmin.classrooms.form.name")}
          />

          <FloatingInputField
            name="code"
            control={form.control}
            label={t("dashboard.schoolAdmin.classrooms.form.code")}
          />

          <FloatingInputField
            name="year"
            control={form.control}
            label={t("dashboard.schoolAdmin.classrooms.form.year")}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="brand"
            className="rounded-2xl"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("dashboard.schoolAdmin.classrooms.actions.creating")
              : t("dashboard.schoolAdmin.classrooms.actions.create")}
          </Button>
        </div>
      </form>
    </F.Form>
  );
};
