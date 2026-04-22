"use client";

import { TStudentFilterValues, TStudentsFilter } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const CounselorStudentsFilter = ({
  value,
  onApply,
  onReset,
}: TStudentsFilter) => {
  const { t } = useI18n();

  const form = useForm<TStudentFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const statusOptions = [
    {
      value: "ALL",
      label: t("dashboard.counselor.student.filters.statusOptions.ALL"),
    },
    {
      value: "ACTIVE",
      label: t("dashboard.counselor.student.filters.statusOptions.ACTIVE"),
    },
    {
      value: "ARCHIVED",
      label: t("dashboard.counselor.student.filters.statusOptions.ARCHIVED"),
    },
  ];

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit(onApply)}
        className="grid gap-4 lg:grid-cols-[1fr_220px_auto]"
      >
        <FloatingInputField
          name="query"
          control={form.control}
          label={t("dashboard.counselor.student.filters.fields.query")}
        />

        <FloatingSelectField
          name="status"
          control={form.control}
          options={statusOptions}
          label={t("dashboard.counselor.student.filters.fields.status")}
        />

        <div className="flex items-end gap-2">
          <Button type="submit" variant="brand" className="h-14 rounded-2xl">
            {t("common.apply")}
          </Button>

          <Button
            type="button"
            variant="brandSoft"
            className="h-14 rounded-2xl"
            onClick={() => {
              form.reset({
                query: "",
                status: "ALL",
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
