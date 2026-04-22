"use client";

import { TCounselorStudentFilter, TStudentFilterValues } from "@/types/modules";
import { counselorStudentFilterSchema } from "@/lib/validation/counselor-schema";
import { FormProvider, useForm } from "react-hook-form";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { AppDialogActions } from "@elements/app-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";

export const CounselorStudentsFilter = ({
  value,
  onApply,
  onReset,
}: TCounselorStudentFilter) => {
  const { t } = useI18n();

  const form = useForm<TStudentFilterValues>({
    resolver: zodResolver(counselorStudentFilterSchema),
    defaultValues: value,
    values: value,
  });

  const statusOptions = [
    {
      value: "ALL",
      label: t("dashboard.counselor.student.filters.statusOptions.ALL"),
    },
    {
      value: "ACTIVE",
      label: t("dashboard.counselor.student.filters.statusOptions.ACTIVE"),
    },
    {
      value: "ARCHIVED",
      label: t("dashboard.counselor.student.filters.statusOptions.ARCHIVED"),
    },
  ];

  return (
    <FormProvider {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((values) => onApply(values))}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField
            control={form.control}
            name="query"
            label={t("dashboard.counselor.student.filters.query")}
          />

          <FloatingSelectField
            control={form.control}
            name="status"
            label={t("dashboard.counselor.student.filters.status")}
            options={statusOptions}
          />
        </div>

        <div className="flex justify-end gap-3">
          <AppDialogActions
            confirmType="submit"
            confirmVariant="brand"
            cancelVariant="brandSoft"
            cancelText={t("common.reset")}
            confirmText={t("common.apply")}
            onCancel={() => {
              form.reset({
                query: "",
                status: "ALL",
              });
              onReset();
            }}
          />
        </div>
      </form>
    </FormProvider>
  );
};
