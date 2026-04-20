"use client";

import { TParentCounselingrequestValues } from "@/lib/validation/parent";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { requestSessionSchema } from "@/lib/validation/parent";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { TCounselingRequest } from "@/types/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";

import * as F from "@ui/form";

const FORM_ID = "parent-request-counseling-form";

export const ParentCounselingRequestDialog = ({
  open,
  onSubmit,
  isLoading,
  childOptions,
  onOpenChange,
}: TCounselingRequest) => {
  const { t } = useI18n();

  const form = useForm<TParentCounselingrequestValues>({
    resolver: zodResolver(requestSessionSchema),
    defaultValues: {
      childId: childOptions[0]?.value || "",
      title: "",
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        childId: childOptions[0]?.value || "",
        title: "",
        note: "",
      });
    }
  }, [childOptions, form, open]);

  return (
    <AppDialog
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.parent.counseling.requestDialog.title")}
      description={t("dashboard.parent.counseling.requestDialog.description")}
      footer={
        <AppDialogActions
          form={FORM_ID}
          confirmType="submit"
          isLoading={isLoading}
          confirmVariant="brand"
          cancelVariant="brandSoft"
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.parent.counseling.requestDialog.action")}
        />
      }
    >
      <F.Form {...form}>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          <FloatingSelectField
            name="childId"
            control={form.control}
            options={childOptions}
            label={t("dashboard.parent.counseling.requestDialog.fields.child")}
          />

          <FloatingInputField
            name="title"
            control={form.control}
            label={t("dashboard.parent.counseling.requestDialog.fields.title")}
          />

          <FloatingInputField
            name="note"
            control={form.control}
            label={t("dashboard.parent.counseling.requestDialog.fields.note")}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
