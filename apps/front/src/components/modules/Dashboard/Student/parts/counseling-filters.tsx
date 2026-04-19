"use client";

import { TStudentCounselingFilterValues } from "@/types/modules";
import { TStudentCounselingFilter } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const StudentCounselingFilters = ({
  value,
  onApply,
  onReset,
}: TStudentCounselingFilter) => {
  const { t } = useI18n();

  const form = useForm<TStudentCounselingFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField<TStudentCounselingFilterValues>
            name="query"
            control={form.control}
            label={t("dashboard.student.counseling.filters.search")}
          />

          <FloatingSelectField<TStudentCounselingFilterValues>
            name="status"
            control={form.control}
            label={t("dashboard.student.counseling.filters.status")}
            options={[
              {
                value: "ALL",
                label: t("dashboard.student.counseling.filters.statusAll"),
              },
              {
                value: "REQUESTED",
                label: t("dashboard.student.counseling.status.REQUESTED"),
              },
              {
                value: "CONFIRMED",
                label: t("dashboard.student.counseling.status.CONFIRMED"),
              },
              {
                value: "COMPLETED",
                label: t("dashboard.student.counseling.status.COMPLETED"),
              },
              {
                value: "CANCELED",
                label: t("dashboard.student.counseling.status.CANCELED"),
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
              const resetValues: TStudentCounselingFilterValues = {
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
