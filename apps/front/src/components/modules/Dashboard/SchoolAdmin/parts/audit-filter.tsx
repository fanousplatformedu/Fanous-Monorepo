"use client";

import { TSchoolAdminAuditLogsFiltersProps } from "@/types/modules";
import { TSchoolAdminAuditLogFilterValues } from "@/types/modules";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const SchoolAuditLogsFilters = ({
  value,
  onApply,
  onReset,
}: TSchoolAdminAuditLogsFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<TSchoolAdminAuditLogFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <FloatingInputField
            name="actorId"
            label={t(
              "dashboard.schoolAdmin.auditLogs.filters.actorId",
              {},
              "Actor ID",
            )}
            control={form.control}
            inputClassName="h-14"
          />

          <FloatingInputField
            name="action"
            label={t(
              "dashboard.schoolAdmin.auditLogs.filters.action",
              {},
              "Action",
            )}
            control={form.control}
            inputClassName="h-14"
          />

          <FloatingInputField
            name="entityType"
            label={t(
              "dashboard.schoolAdmin.auditLogs.filters.entityType",
              {},
              "Entity Type",
            )}
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
              {t("common.apply", {}, "Apply")}
            </Button>

            <Button
              type="button"
              variant="brandOutline"
              className="h-11 min-w-[130px] rounded-2xl"
              onClick={() => {
                const resetValues: TSchoolAdminAuditLogFilterValues = {
                  actorId: "",
                  action: "",
                  entityType: "",
                };

                form.reset(resetValues);
                onReset();
              }}
            >
              {t("common.reset", {}, "Reset")}
            </Button>
          </div>
        </div>
      </form>
    </F.Form>
  );
};
