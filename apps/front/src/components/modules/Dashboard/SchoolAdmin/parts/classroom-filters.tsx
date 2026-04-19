"use client";

import { TClassroomFiltersValues } from "@/lib/validation/school-admin";
import { TClassroomFiltersProps } from "@/types/modules";
import { classroomFiltersSchema } from "@/lib/validation/school-admin";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ClassroomFilters = ({
  onApply,
  onReset,
  gradeOptions,
  initialValues,
}: TClassroomFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<TClassroomFiltersValues>({
    resolver: zodResolver(classroomFiltersSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <FloatingInputField
            name="query"
            control={form.control}
            label={t("dashboard.schoolAdmin.classrooms.filters.query")}
          />

          <FloatingSelectField
            name="gradeId"
            control={form.control}
            options={gradeOptions}
            label={t("dashboard.schoolAdmin.classrooms.filters.grade")}
          />

          <FloatingSelectField
            name="scope"
            control={form.control}
            label={t("dashboard.schoolAdmin.classrooms.filters.scope")}
            options={[
              {
                value: "ACTIVE_ONLY",
                label: t(
                  "dashboard.schoolAdmin.classrooms.filters.scopeActiveOnly",
                ),
              },
              {
                value: "ALL",
                label: t("dashboard.schoolAdmin.classrooms.filters.scopeAll"),
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            variant="brand"
            className="h-11 min-w-[130px] rounded-2xl"
          >
            {t("common.apply")}
          </Button>

          <Button
            type="button"
            variant="brandOutline"
            className="h-11 min-w-[130px] rounded-2xl"
            onClick={() => {
              form.reset({
                query: "",
                gradeId: gradeOptions[0]?.value ?? "",
                scope: "ACTIVE_ONLY",
              });
              onReset();
            }}
          >
            {t("common.reset")}
          </Button>
        </div>
      </form>
    </F.Form>
  );
};
