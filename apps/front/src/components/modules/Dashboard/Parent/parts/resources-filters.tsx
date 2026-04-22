"use client";

import { TParentResourcesFilterValues } from "@/types/modules";
import { resourcesFiltersSchema } from "@/lib/validation/parent-schemas";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { TResourcesFilters } from "@/types/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ParentResourcesFilters = ({
  value,
  onApply,
  onReset,
}: TResourcesFilters) => {
  const { t } = useI18n();

  const form = useForm<TParentResourcesFilterValues>({
    resolver: zodResolver(resourcesFiltersSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const categoryOptions = [
    {
      value: "ALL",
      label: t("dashboard.parent.resources.filters.categoryOptions.ALL"),
    },
    {
      value: "WELLBEING",
      label: t("dashboard.parent.resources.categories.WELLBEING"),
    },
    {
      value: "CAREER_GUIDE",
      label: t("dashboard.parent.resources.categories.CAREER_GUIDE"),
    },
    {
      value: "SUPPORT_TEEN",
      label: t("dashboard.parent.resources.categories.SUPPORT_TEEN"),
    },
    {
      value: "STUDY_SUPPORT",
      label: t("dashboard.parent.resources.categories.STUDY_SUPPORT"),
    },
    {
      value: "COMMUNICATION",
      label: t("dashboard.parent.resources.categories.COMMUNICATION"),
    },
  ];

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onApply(values))}
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField
            name="query"
            control={form.control}
            label={t("dashboard.parent.resources.filters.fields.query")}
          />

          <FloatingSelectField
            name="category"
            control={form.control}
            options={categoryOptions}
            label={t("dashboard.parent.resources.filters.fields.category")}
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
                category: "ALL",
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
