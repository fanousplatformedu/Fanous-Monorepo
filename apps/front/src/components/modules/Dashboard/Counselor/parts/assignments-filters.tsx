"use client";

import { TCounselorAssignmentsFilterFormValues } from "@/lib/validation/counselor-schema";
import { counselorAssignmentsFilterSchema } from "@/lib/validation/counselor-schema";
import { TCounselorAssignmentsFilterProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";
import * as L from "lucide-react";

export const CounselorAssignmentsFilter = ({
  value,
  onApply,
  onReset,
  studentOptions,
}: TCounselorAssignmentsFilterProps) => {
  const { t } = useI18n();

  const form = useForm<TCounselorAssignmentsFilterFormValues>({
    resolver: zodResolver(counselorAssignmentsFilterSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onApply(values))}
        className="space-y-5"
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <FloatingInputField
            name="query"
            control={form.control}
            label={t("dashboard.counselor.assignments.filters.query")}
          />

          <FloatingSelectField
            name="studentId"
            control={form.control}
            label={t("dashboard.counselor.assignments.filters.student")}
            options={[
              { value: "ALL", label: t("common.all") },
              ...studentOptions,
            ]}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              const nextValues = {
                query: "",
                studentId: "ALL",
              };
              form.reset(nextValues);
              onReset();
            }}
          >
            <L.RotateCcw className="mr-2 h-4 w-4" />
            {t("common.reset")}
          </Button>

          <Button type="submit" variant="brand" className="rounded-2xl">
            <L.Search className="mr-2 h-4 w-4" />
            {t("common.applyFilters")}
          </Button>
        </div>
      </form>
    </F.Form>
  );
};
