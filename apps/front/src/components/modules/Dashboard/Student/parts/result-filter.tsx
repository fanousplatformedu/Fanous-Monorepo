"use client";

import { TResultFilterValues, TResultFiltersProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const StudentResultFilters = ({
  value,
  onApply,
  onReset,
}: TResultFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<TResultFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingSelectField<TResultFilterValues>
            control={form.control}
            name="dominantIntelligence"
            label={t("dashboard.student.results.filters.dominantIntelligence")}
            options={[
              {
                value: "ALL",
                label: t("dashboard.student.results.filters.all"),
              },
              {
                value: "LINGUISTIC",
                label: t("dashboard.student.results.intelligences.LINGUISTIC"),
              },
              {
                value: "LOGICAL_MATHEMATICAL",
                label: t(
                  "dashboard.student.results.intelligences.LOGICAL_MATHEMATICAL",
                ),
              },
              {
                value: "MUSICAL",
                label: t("dashboard.student.results.intelligences.MUSICAL"),
              },
              {
                value: "BODILY_KINESTHETIC",
                label: t(
                  "dashboard.student.results.intelligences.BODILY_KINESTHETIC",
                ),
              },
              {
                value: "VISUAL_SPATIAL",
                label: t(
                  "dashboard.student.results.intelligences.VISUAL_SPATIAL",
                ),
              },
              {
                value: "NATURALISTIC",
                label: t(
                  "dashboard.student.results.intelligences.NATURALISTIC",
                ),
              },
              {
                value: "INTERPERSONAL",
                label: t(
                  "dashboard.student.results.intelligences.INTERPERSONAL",
                ),
              },
              {
                value: "INTRAPERSONAL",
                label: t(
                  "dashboard.student.results.intelligences.INTRAPERSONAL",
                ),
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
              const resetValues: TResultFilterValues = {
                dominantIntelligence: "ALL",
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
