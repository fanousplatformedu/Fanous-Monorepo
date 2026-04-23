"use client";

import { TCounselorReviewsFilter, TReviewFilterValues } from "@/types/modules";
import { TReviewFilterFormValues } from "@/lib/validation/counselor-schema";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { reviewFilterSchema } from "@/lib/validation/counselor-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";
import * as L from "lucide-react";

export const CounselorReviewsFilter = ({
  value,
  onApply,
  onReset,
  studentOptions,
  assignmentOptions,
}: TCounselorReviewsFilter) => {
  const { t } = useI18n();

  const form = useForm<TReviewFilterFormValues>({
    resolver: zodResolver(reviewFilterSchema),
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [form, value]);

  const statusOptions = [
    { value: "ALL", label: t("common.all") },
    {
      value: "PENDING",
      label: t("dashboard.counselor.reviews.status.PENDING"),
    },
    {
      value: "IN_REVIEW",
      label: t("dashboard.counselor.reviews.status.IN_REVIEW"),
    },
    {
      value: "REVIEWED",
      label: t("dashboard.counselor.reviews.status.REVIEWED"),
    },
    {
      value: "RETURNED",
      label: t("dashboard.counselor.reviews.status.RETURNED"),
    },
  ];

  return (
    <F.Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onApply(values))}
        className="space-y-5"
      >
        <div className="grid gap-4 xl:grid-cols-4">
          <FloatingInputField
            name="query"
            control={form.control}
            label={t("dashboard.counselor.reviews.filters.query")}
          />

          <FloatingSelectField
            name="status"
            control={form.control}
            options={statusOptions}
            label={t("dashboard.counselor.reviews.filters.status")}
          />

          <FloatingSelectField
            name="studentId"
            control={form.control}
            label={t("dashboard.counselor.reviews.filters.student")}
            options={[
              { value: "ALL", label: t("common.all") },
              ...studentOptions,
            ]}
          />

          <FloatingSelectField
            name="assignmentId"
            control={form.control}
            label={t("dashboard.counselor.reviews.filters.assignment")}
            options={[
              { value: "ALL", label: t("common.all") },
              ...assignmentOptions,
            ]}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => {
              const nextValues: TReviewFilterValues = {
                query: "",
                status: "ALL",
                studentId: "ALL",
                assignmentId: "ALL",
              };
              form.reset(nextValues);
              onReset();
            }}
          >
            <L.RotateCcw className="mr-2 h-4 w-4" />
            {t("common.reset")}
          </Button>

          <Button type="submit" variant="brand" className="rounded-2xl">
            <L.Search className="mr-2 h-4 w-4" />
            {t("common.applyFilters")}
          </Button>
        </div>
      </form>
    </F.Form>
  );
};
