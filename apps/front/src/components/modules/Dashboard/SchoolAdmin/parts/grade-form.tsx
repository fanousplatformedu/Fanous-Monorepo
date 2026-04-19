"use client";

import { gradeSchema, TGradeFormValues } from "@/lib/validation/school-admin";
import { FloatingInputField } from "@elements/floating-input-field";
import { TGradeFormProps } from "@/types/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const GradeForm = ({ isSubmitting, onSubmit }: TGradeFormProps) => {
  const { t } = useI18n();

  const form = useForm<TGradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const handleSubmit = async (values: TGradeFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid gap-4 md:grid-cols-[1fr_240px_190px]"
      >
        <FloatingInputField
          name="name"
          control={form.control}
          label={t("dashboard.schoolAdmin.grades.form.fields.name")}
        />

        <FloatingInputField
          name="code"
          control={form.control}
          label={t("dashboard.schoolAdmin.grades.form.fields.code")}
        />

        <Button
          type="submit"
          variant="brand"
          disabled={isSubmitting}
          className="h-14 rounded-2xl"
        >
          {isSubmitting
            ? t("dashboard.schoolAdmin.grades.actions.creating")
            : t("dashboard.schoolAdmin.grades.actions.create")}
        </Button>
      </form>
    </F.Form>
  );
};
