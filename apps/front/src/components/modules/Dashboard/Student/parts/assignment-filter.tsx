"use client";

import { TStudentAssignmentFilterValues } from "@/types/modules";
import { TStudentAssignmentFilter } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const StudentAssignmentFilters = ({
  value,
  onApply,
  onReset,
}: TStudentAssignmentFilter) => {
  const { t } = useI18n();

  const form = useForm<TStudentAssignmentFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField<TStudentAssignmentFilterValues>
            name="query"
            control={form.control}
            label={t("dashboard.student.assignments.filters.search")}
          />

          <FloatingSelectField<TStudentAssignmentFilterValues>
            name="status"
            control={form.control}
            label={t("dashboard.student.assignments.filters.status")}
            options={[
              {
                value: "ALL",
                label: t("dashboard.student.assignments.filters.statusAll"),
              },
              {
                value: "NOT_STARTED",
                label: t("dashboard.student.assignments.status.NOT_STARTED"),
              },
              {
                value: "PENDING",
                label: t("dashboard.student.assignments.status.PENDING"),
              },
              {
                value: "IN_PROGRESS",
                label: t("dashboard.student.assignments.status.IN_PROGRESS"),
              },
              {
                value: "SUBMITTED",
                label: t("dashboard.student.assignments.status.SUBMITTED"),
              },
              {
                value: "EVALUATED",
                label: t("dashboard.student.assignments.status.EVALUATED"),
              },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              const resetValues: TStudentAssignmentFilterValues = {
                query: "",
                status: "ALL",
              };
              form.reset(resetValues);
              onReset();
            }}
          >
            {t("common.reset")}
          </Button>
          <Button type="submit" variant="brand" className="rounded-2xl">
            {t("common.apply")}
          </Button>
        </div>
      </form>
    </F.Form>
  );
};
