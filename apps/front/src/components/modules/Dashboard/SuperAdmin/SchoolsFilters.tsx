"use client";

import { TSchoolFilterValues, TSchoolsFiltersProps } from "@/types/modules";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";

import * as F from "@ui/form";

const statusOptions: Array<{
  value: TSchoolFilterValues["status"];
  labelKey: string;
}> = [
  {
    value: "",
    labelKey: "common.all",
  },
  {
    value: "ACTIVE",
    labelKey: "dashboard.superAdmin.status.active",
  },
  {
    value: "SUSPENDED",
    labelKey: "dashboard.superAdmin.status.suspended",
  },
  {
    value: "ARCHIVED",
    labelKey: "dashboard.superAdmin.status.archived",
  },
];

const SchoolsFilters = ({ value, onApply, onReset }: TSchoolsFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<TSchoolFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const selectedStatus = form.watch("status");

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="min-w-0">
          <FloatingInputField
            name="query"
            inputClassName="h-14"
            control={form.control}
            label={t("dashboard.superAdmin.schools.filters.search")}
          />
        </div>

        <div className="rounded-[1.5rem] border border-border/50 bg-secondary/15 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t("dashboard.superAdmin.schools.filters.status")}
              </p>

              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const active = selectedStatus === option.value;

                  return (
                    <Button
                      key={String(option.value || "ALL")}
                      type="button"
                      size="default"
                      variant="brandChip"
                      data-state={active ? "active" : "inactive"}
                      className="h-11 rounded-2xl px-4"
                      onClick={() =>
                        form.setValue("status", option.value, {
                          shouldDirty: true,
                          shouldTouch: true,
                        })
                      }
                    >
                      {t(option.labelKey)}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <Button
                type="submit"
                variant="brand"
                className="h-11 min-w-[130px] rounded-2xl"
              >
                {t("common.apply")}
              </Button>

              <Button
                type="button"
                variant="brandSoft"
                className="h-11 min-w-[130px] rounded-2xl"
                onClick={() => {
                  const resetValues: TSchoolFilterValues = {
                    query: "",
                    status: "",
                  };

                  form.reset(resetValues);
                  onReset();
                }}
              >
                {t("common.reset")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </F.Form>
  );
};

export default SchoolsFilters;
