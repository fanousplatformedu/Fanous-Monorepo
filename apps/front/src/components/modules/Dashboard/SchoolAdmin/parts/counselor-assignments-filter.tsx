"use client";

import { TCounselorAssignmentsFilterValues } from "@/lib/validation/school-admin-schemas";
import { CounselorAssignmentsFilterSchema } from "@/lib/validation/school-admin-schemas";
import { TCounselorAssignmentsFilters } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const CounselorAssignmentsFilters = ({
  value,
  onReset,
  onApply,
  studentOptions,
  counselorOptions,
}: TCounselorAssignmentsFilters) => {
  const { t } = useI18n();

  const form = useForm<TCounselorAssignmentsFilterValues>({
    resolver: zodResolver(CounselorAssignmentsFilterSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          onApply({
            query: values.query,
            counselorId: values.counselorId as string | "ALL",
            studentId: values.studentId as string | "ALL",
            status: values.status as "ALL" | "ACTIVE" | "ARCHIVED",
          }),
        )}
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FloatingInputField
            control={form.control}
            name="query"
            label={t(
              "dashboard.schoolAdmin.counselorAssignments.filters.query",
            )}
          />

          <FloatingSelectField
            control={form.control}
            name="counselorId"
            label={t(
              "dashboard.schoolAdmin.counselorAssignments.filters.counselor",
            )}
            options={[
              {
                value: "ALL",
                label: t(
                  "dashboard.schoolAdmin.counselorAssignments.filters.allCounselors",
                ),
              },
              ...counselorOptions,
            ]}
          />

          <FloatingSelectField
            control={form.control}
            name="studentId"
            label={t(
              "dashboard.schoolAdmin.counselorAssignments.filters.student",
            )}
            options={[
              {
                value: "ALL",
                label: t(
                  "dashboard.schoolAdmin.counselorAssignments.filters.allStudents",
                ),
              },
              ...studentOptions,
            ]}
          />

          <FloatingSelectField
            control={form.control}
            name="status"
            label={t(
              "dashboard.schoolAdmin.counselorAssignments.filters.status",
            )}
            options={[
              {
                value: "ALL",
                label: t(
                  "dashboard.schoolAdmin.counselorAssignments.filters.allStatuses",
                ),
              },
              {
                value: "ACTIVE",
                label: t("status.active"),
              },
              {
                value: "ARCHIVED",
                label: t("status.archived"),
              },
            ]}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              form.reset({
                query: "",
                counselorId: "ALL",
                studentId: "ALL",
                status: "ALL",
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
