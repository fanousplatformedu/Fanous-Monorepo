"use client";

import { TSchoolAdminsFiltersProps } from "@/types/modules";
import { TSchoolAdminFilterValues } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { useSchoolsQuery } from "@/lib/redux/api";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

const statusOptions: Array<{
  value: TSchoolAdminFilterValues["status"];
  labelKey: string;
}> = [
  { value: "", labelKey: "common.all" },
  {
    value: "ACTIVE",
    labelKey: "dashboard.superAdmin.schoolAdmins.status.active",
  },
  {
    value: "DISABLED",
    labelKey: "dashboard.superAdmin.schoolAdmins.status.disabled",
  },
  {
    value: "DELETED",
    labelKey: "dashboard.superAdmin.schoolAdmins.status.deleted",
  },
];

const SchoolAdminsFilters = ({
  value,
  onApply,
  onReset,
}: TSchoolAdminsFiltersProps) => {
  const { t } = useI18n();

  const { data: schoolsData } = useSchoolsQuery({
    take: 100,
    skip: 0,
  });

  const form = useForm<TSchoolAdminFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const selectedStatus = form.watch("status");

  const schoolOptions = [
    {
      value: "ALL",
      label: t("common.all"),
    },
    ...((schoolsData?.items ?? []).map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? []),
  ];

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          onApply({
            schoolId: values.schoolId === "ALL" ? "" : values.schoolId,
            status: values.status,
          }),
        )}
        className="space-y-5"
      >
        <div className="min-w-0">
          <FloatingSelectField
            name="schoolId"
            control={form.control}
            options={schoolOptions}
            label={t("dashboard.superAdmin.schoolAdmins.filters.school")}
          />
        </div>

        <div className="rounded-[1.5rem] border border-border/50 bg-secondary/15 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t("dashboard.superAdmin.schoolAdmins.filters.status")}
              </p>

              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const active = selectedStatus === option.value;

                  return (
                    <Button
                      key={String(option.value || "ALL")}
                      type="button"
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
                variant="brandOutline"
                className="h-11 min-w-[130px] rounded-2xl"
                onClick={() => {
                  const resetValues: TSchoolAdminFilterValues = {
                    schoolId: "",
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

export default SchoolAdminsFilters;
