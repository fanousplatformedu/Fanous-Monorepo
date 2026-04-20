"use client";

import { TParentCounselingFilterValues } from "@/types/modules";
import { counselingFiltersSchema } from "@/lib/validation/parent";
import { TParentCounselingFilter } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ParentCounselingFilters = ({
  value,
  onApply,
  onReset,
  childOptions,
}: TParentCounselingFilter) => {
  const { t } = useI18n();

  const form = useForm<TParentCounselingFilterValues>({
    resolver: zodResolver(counselingFiltersSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const statusOptions = [
    {
      value: "ALL",
      label: t("dashboard.parent.counseling.filters.statusOptions.ALL"),
    },
    {
      value: "REQUESTED",
      label: t("dashboard.parent.counseling.filters.statusOptions.REQUESTED"),
    },
    {
      value: "CONFIRMED",
      label: t("dashboard.parent.counseling.filters.statusOptions.CONFIRMED"),
    },
    {
      value: "COMPLETED",
      label: t("dashboard.parent.counseling.filters.statusOptions.COMPLETED"),
    },
    {
      value: "CANCELED",
      label: t("dashboard.parent.counseling.filters.statusOptions.CANCELED"),
    },
  ];

  const allChildrenOptions = [
    {
      value: "ALL",
      label: t("dashboard.parent.counseling.filters.childOptions.ALL"),
    },
    ...childOptions,
  ];

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onApply(values))}
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <FloatingInputField
            name="query"
            control={form.control}
            label={t("dashboard.parent.counseling.filters.fields.query")}
          />

          <FloatingSelectField
            name="status"
            control={form.control}
            options={statusOptions}
            label={t("dashboard.parent.counseling.filters.fields.status")}
          />

          <FloatingSelectField
            name="childId"
            control={form.control}
            options={allChildrenOptions}
            label={t("dashboard.parent.counseling.filters.fields.child")}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              form.reset({
                query: "",
                status: "ALL",
                childId: "ALL",
              });
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
