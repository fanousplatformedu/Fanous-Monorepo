"use client";

import { TStudentNotificationFilterValues } from "@/types/modules";
import { TStudentNotificationFilter } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const StudentNotificationFilters = ({
  value,
  onApply,
  onReset,
}: TStudentNotificationFilter) => {
  const { t } = useI18n();

  const form = useForm<TStudentNotificationFilterValues>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingSelectField<TStudentNotificationFilterValues>
            control={form.control}
            name="unreadOnly"
            label={t("dashboard.student.notifications.filters.visibility")}
            options={[
              {
                value: "ALL",
                label: t("dashboard.student.notifications.filters.all"),
              },
              {
                value: "UNREAD",
                label: t("dashboard.student.notifications.filters.unread"),
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
              const resetValues: TStudentNotificationFilterValues = {
                unreadOnly: "ALL",
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
