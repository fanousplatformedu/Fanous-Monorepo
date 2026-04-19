"use client";

import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";

import * as F from "@ui/form";
import * as T from "@/types/modules";

export const MembersFilters = ({
  value,
  onApply,
  onReset,
}: T.TMembersFiltersProps) => {
  const { t } = useI18n();

  const form = useForm<T.TSchoolMemberFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const roleOptions: Array<{
    value: T.TSchoolMemberRoleFilter;
    label: string;
  }> = [
    {
      value: "ALL",
      label: t("dashboard.schoolAdmin.members.filters.options.allRoles"),
    },
    {
      value: "STUDENT",
      label: t("dashboard.schoolAdmin.members.roles.STUDENT"),
    },
    {
      value: "PARENT",
      label: t("dashboard.schoolAdmin.members.roles.PARENT"),
    },
    {
      value: "COUNSELOR",
      label: t("dashboard.schoolAdmin.members.roles.COUNSELOR"),
    },
    {
      value: "SCHOOL_ADMIN",
      label: t("dashboard.schoolAdmin.members.roles.SCHOOL_ADMIN"),
    },
  ];

  const statusOptions: Array<{
    value: T.TSchoolMemberStatusFilter;
    label: string;
  }> = [
    {
      value: "ALL",
      label: t("dashboard.schoolAdmin.members.filters.options.allStatuses"),
    },
    {
      value: "ACTIVE",
      label: t("dashboard.schoolAdmin.members.status.ACTIVE"),
    },
    {
      value: "DISABLED",
      label: t("dashboard.schoolAdmin.members.status.DISABLED"),
    },
  ];

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <FloatingInputField
            name="query"
            control={form.control}
            label={t("dashboard.schoolAdmin.members.filters.fields.query")}
          />

          <FloatingSelectField
            name="role"
            options={roleOptions}
            control={form.control}
            label={t("dashboard.schoolAdmin.members.filters.fields.role")}
          />

          <FloatingSelectField
            name="status"
            control={form.control}
            options={statusOptions}
            label={t("dashboard.schoolAdmin.members.filters.fields.status")}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              const resetValues: T.TSchoolMemberFilterValues = {
                query: "",
                role: "ALL",
                status: "ALL",
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
