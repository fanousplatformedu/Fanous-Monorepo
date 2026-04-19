"use client";

import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";
import * as T from "@/types/modules";

export const AccessRequestFilters = ({
  value,
  onApply,
  onReset,
}: T.TAccessRequestFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<T.TAccessRequestFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const statusOptions: Array<{
    value: T.TAccessRequestFilterStatus;
    label: string;
  }> = [
    {
      value: "ALL",
      label: t("dashboard.schoolAdmin.accessRequests.filters.statusAll"),
    },
    {
      value: "PENDING",
      label: t("dashboard.schoolAdmin.accessRequests.status.PENDING"),
    },
    {
      value: "APPROVED",
      label: t("dashboard.schoolAdmin.accessRequests.status.APPROVED"),
    },
    {
      value: "REJECTED",
      label: t("dashboard.schoolAdmin.accessRequests.status.REJECTED"),
    },
    {
      value: "CANCELED",
      label: t("dashboard.schoolAdmin.accessRequests.status.CANCELED"),
    },
  ];

  const roleOptions: Array<{
    label: string;
    value: T.TAccessRequestFilterRole;
  }> = [
    {
      value: "ALL",
      label: t("dashboard.schoolAdmin.accessRequests.filters.roleAll"),
    },
    {
      value: "STUDENT",
      label: t("dashboard.schoolAdmin.accessRequests.roles.STUDENT"),
    },
    {
      value: "PARENT",
      label: t("dashboard.schoolAdmin.accessRequests.roles.PARENT"),
    },
    {
      value: "COUNSELOR",
      label: t("dashboard.schoolAdmin.accessRequests.roles.COUNSELOR"),
    },
  ];

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <FloatingInputField
            name="query"
            inputClassName="h-14"
            control={form.control}
            label={t("dashboard.schoolAdmin.accessRequests.filters.query")}
          />

          <FloatingSelectField
            name="status"
            control={form.control}
            options={statusOptions}
            label={t("dashboard.schoolAdmin.accessRequests.filters.status")}
          />

          <FloatingSelectField
            name="requestedRole"
            options={roleOptions}
            control={form.control}
            label={t(
              "dashboard.schoolAdmin.accessRequests.filters.requestedRole",
            )}
          />
        </div>

        <div className="rounded-[1.5rem] border border-border/50 bg-secondary/15 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
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
                const resetValues: T.TAccessRequestFilterValues = {
                  query: "",
                  status: "ALL",
                  requestedRole: "ALL",
                };
                form.reset(resetValues);
                onReset();
              }}
            >
              {t("common.reset")}
            </Button>
          </div>
        </div>
      </form>
    </F.Form>
  );
};
