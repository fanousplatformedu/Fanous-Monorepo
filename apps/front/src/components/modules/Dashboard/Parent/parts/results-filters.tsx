"use client";

import { TParentResultsFilterValues } from "@/types/modules";
import { resultsFiltersSchema } from "@/lib/validation/parent-schemas";
import { TParentResultFilters } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ParentResultsFilters = ({
  value,
  onApply,
  onReset,
  childOptions,
}: TParentResultFilters) => {
  const { t } = useI18n();

  const form = useForm<TParentResultsFilterValues>({
    resolver: zodResolver(resultsFiltersSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const allChildrenOptions = [
    {
      value: "ALL",
      label: t("dashboard.parent.results.filters.childOptions.ALL"),
    },
    ...childOptions,
  ];

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onApply(values))}
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-1 xl:max-w-md">
          <FloatingSelectField
            name="childId"
            control={form.control}
            options={allChildrenOptions}
            label={t("dashboard.parent.results.filters.fields.child")}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              form.reset({ childId: "ALL" });
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
