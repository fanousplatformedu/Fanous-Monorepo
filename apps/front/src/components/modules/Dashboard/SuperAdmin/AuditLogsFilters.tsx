"use client";

import { TAuditLogFilterValues, TAuditLogsFiltersProps } from "@/types/modules";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";

import * as F from "@ui/form";

const AuditLogsFilters = ({
  value,
  onApply,
  onReset,
}: TAuditLogsFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<TAuditLogFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField
            name="schoolId"
            label={t("dashboard.superAdmin.auditLogs.filters.schoolId")}
            control={form.control}
            inputClassName="h-14"
          />

          <FloatingInputField
            name="actorId"
            label={t("dashboard.superAdmin.auditLogs.filters.actorId")}
            control={form.control}
            inputClassName="h-14"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField
            name="action"
            label={t("dashboard.superAdmin.auditLogs.filters.action")}
            control={form.control}
            inputClassName="h-14"
          />

          <FloatingInputField
            name="entityType"
            label={t("dashboard.superAdmin.auditLogs.filters.entityType")}
            control={form.control}
            inputClassName="h-14"
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
              variant="brandOutline"
              className="h-11 min-w-[130px] rounded-2xl"
              onClick={() => {
                const resetValues: TAuditLogFilterValues = {
                  schoolId: "",
                  actorId: "",
                  action: "",
                  entityType: "",
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

export default AuditLogsFilters;
