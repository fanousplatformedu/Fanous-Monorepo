"use client";

import { TParentActivitiesFilterValues } from "@/types/modules";
import { activitiesFiltersSchema } from "@/lib/validation/parent";
import { FloatingSelectField } from "@elements/floating-select-field";
import { TActivitiesFilters } from "@/types/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ParentActivitiesFilters = ({
  value,
  onApply,
  onReset,
  childOptions,
}: TActivitiesFilters) => {
  const { t } = useI18n();

  const form = useForm<TParentActivitiesFilterValues>({
    resolver: zodResolver(activitiesFiltersSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const allChildrenOptions = [
    {
      value: "ALL",
      label: t("dashboard.parent.activities.filters.childOptions.ALL"),
    },
    ...childOptions,
  ];

  const typeOptions = [
    {
      value: "ALL",
      label: t("dashboard.parent.activities.filters.typeOptions.ALL"),
    },
    {
      value: "ASSIGNMENT_ASSIGNED",
      label: t("dashboard.parent.activities.types.ASSIGNMENT_ASSIGNED"),
    },
    {
      value: "ASSIGNMENT_STARTED",
      label: t("dashboard.parent.activities.types.ASSIGNMENT_STARTED"),
    },
    {
      value: "ASSIGNMENT_SUBMITTED",
      label: t("dashboard.parent.activities.types.ASSIGNMENT_SUBMITTED"),
    },
    {
      value: "ASSESSMENT_COMPLETED",
      label: t("dashboard.parent.activities.types.ASSESSMENT_COMPLETED"),
    },
    {
      value: "RESULT_PUBLISHED",
      label: t("dashboard.parent.activities.types.RESULT_PUBLISHED"),
    },
    {
      value: "SESSION_REQUESTED",
      label: t("dashboard.parent.activities.types.SESSION_REQUESTED"),
    },
    {
      value: "SESSION_BOOKED",
      label: t("dashboard.parent.activities.types.SESSION_BOOKED"),
    },
    {
      value: "SESSION_COMPLETED",
      label: t("dashboard.parent.activities.types.SESSION_COMPLETED"),
    },
    {
      value: "PROFILE_UPDATED",
      label: t("dashboard.parent.activities.types.PROFILE_UPDATED"),
    },
    {
      value: "CAREER_MATCH_UPDATED",
      label: t("dashboard.parent.activities.types.CAREER_MATCH_UPDATED"),
    },
  ];

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onApply(values))}
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingSelectField
            name="childId"
            control={form.control}
            options={allChildrenOptions}
            label={t("dashboard.parent.activities.filters.fields.child")}
          />

          <FloatingSelectField
            name="type"
            options={typeOptions}
            control={form.control}
            label={t("dashboard.parent.activities.filters.fields.type")}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              form.reset({
                childId: "ALL",
                type: "ALL",
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
