"use client";

import { TChildrenFilter, TParentChildrenFilterValues } from "@/types/modules";
import { childrenFiltersSchema } from "@/lib/validation/parent";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ParentChildrenFilters = ({
  value,
  onApply,
  onReset,
  childOptions,
}: TChildrenFilter) => {
  const { t } = useI18n();

  const form = useForm<TParentChildrenFilterValues>({
    resolver: zodResolver(childrenFiltersSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const allChildrenOptions = [
    {
      value: "ALL",
      label: t("dashboard.parent.children.filters.childOptions.ALL"),
    },
    ...childOptions,
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
            label={t("dashboard.parent.children.filters.fields.query")}
          />

          <FloatingSelectField
            name="childId"
            control={form.control}
            options={allChildrenOptions}
            label={t("dashboard.parent.children.filters.fields.child")}
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
