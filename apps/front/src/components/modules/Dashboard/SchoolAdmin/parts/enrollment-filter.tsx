"use client";

import { TEnrollmentFiltersProps, TOption } from "@/types/modules";
import { enrollmentFilterSchema } from "@/lib/validation/school-admin-schemas";
import { TEnrollmentFilterForm } from "@/lib/validation/school-admin-schemas";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { ALL_GRADES_VALUE } from "@/utils/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const EnrollmentFilters = ({
  onApply,
  onReset,
  gradeFilter,
  gradeOptions,
  studentSearch,
  isSearching = false,
}: TEnrollmentFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<TEnrollmentFilterForm>({
    resolver: zodResolver(enrollmentFilterSchema),
    defaultValues: {
      gradeFilter: gradeFilter || ALL_GRADES_VALUE,
      studentSearch,
    },
  });

  useEffect(() => {
    form.reset({
      gradeFilter: gradeFilter || ALL_GRADES_VALUE,
      studentSearch,
    });
  }, [form, gradeFilter, studentSearch]);

  const normalizedGradeOptions: TOption[] = [
    {
      value: ALL_GRADES_VALUE,
      label: t("dashboard.schoolAdmin.enrollments.filters.allGrades"),
    },
    ...gradeOptions.filter((option) => option.value !== ""),
  ];

  const handleSubmit = (values: TEnrollmentFilterForm) => {
    onApply({
      gradeFilter:
        values.gradeFilter === ALL_GRADES_VALUE ? "" : values.gradeFilter,
      studentSearch: values.studentSearch,
    });
  };

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingSelectField
            name="gradeFilter"
            control={form.control}
            options={normalizedGradeOptions}
            label={t("dashboard.schoolAdmin.enrollments.filters.grade")}
          />

          <FloatingInputField
            name="studentSearch"
            control={form.control}
            label={t("dashboard.schoolAdmin.enrollments.filters.studentSearch")}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            variant="brand"
            disabled={isSearching}
            className="h-11 min-w-[130px] rounded-2xl"
          >
            {isSearching
              ? t("dashboard.schoolAdmin.enrollments.filters.searching")
              : t("dashboard.schoolAdmin.enrollments.filters.search")}
          </Button>

          <Button
            type="button"
            variant="brandOutline"
            className="h-11 min-w-[130px] rounded-2xl"
            onClick={() => {
              form.reset({
                gradeFilter: ALL_GRADES_VALUE,
                studentSearch: "",
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
