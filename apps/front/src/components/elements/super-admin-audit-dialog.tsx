"use client";

import { TCreateAuditLogDialogProps } from "@/types/modules";
import { useCreateAuditLogMutation } from "@/lib/redux/api";
import { createAuditLogSchema } from "@/lib/validation/super-admin";
import { FloatingInputField } from "@elements/floating-input-field";
import { getApiErrorMessage } from "@/utils/function-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";
import { z } from "zod";

import * as D from "@ui/dialog";
import * as F from "@ui/form";

type Values = z.infer<typeof createAuditLogSchema>;

export const CreateAuditLogDialog = ({
  open,
  onOpenChange,
}: TCreateAuditLogDialogProps) => {
  const { t } = useI18n();

  const [createAuditLog, { isLoading }] = useCreateAuditLogMutation();

  const form = useForm<Values>({
    resolver: zodResolver(createAuditLogSchema),
    defaultValues: {
      schoolId: "",
      action: "",
      entityType: "",
      entityId: "",
      metadata: "",
    },
  });

  const onSubmit = async (values: Values) => {
    try {
      await createAuditLog({
        schoolId: values.schoolId?.trim() || undefined,
        action: values.action.trim(),
        entityType: values.entityType?.trim() || undefined,
        entityId: values.entityId?.trim() || undefined,
        metadata: values.metadata ? JSON.parse(values.metadata) : undefined,
      }).unwrap();

      toast.success(t("dashboard.superAdmin.auditLogs.toasts.createSuccess"));
      form.reset();
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.superAdmin.auditLogs.toasts.createFailed"),
        ),
      );
    }
  };

  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent className="rounded-[1.75rem] border-border/60 bg-card/90 backdrop-blur-2xl sm:max-w-xl">
        <D.DialogHeader>
          <D.DialogTitle>
            {t("dashboard.superAdmin.auditLogs.dialog.title")}
          </D.DialogTitle>
          <D.DialogDescription>
            {t("dashboard.superAdmin.auditLogs.dialog.description")}
          </D.DialogDescription>
        </D.DialogHeader>

        <F.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FloatingInputField
              name="action"
              label={t("dashboard.superAdmin.auditLogs.dialog.fields.action")}
              control={form.control}
            />
            <FloatingInputField
              name="schoolId"
              label={t("dashboard.superAdmin.auditLogs.dialog.fields.schoolId")}
              control={form.control}
            />
            <FloatingInputField
              name="entityType"
              label={t(
                "dashboard.superAdmin.auditLogs.dialog.fields.entityType",
              )}
              control={form.control}
            />
            <FloatingInputField
              name="entityId"
              label={t("dashboard.superAdmin.auditLogs.dialog.fields.entityId")}
              control={form.control}
            />
            <FloatingInputField
              name="metadata"
              label={t("dashboard.superAdmin.auditLogs.dialog.fields.metadata")}
              control={form.control}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="brandSoft"
                className="rounded-2xl"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>

              <Button
                type="submit"
                variant="brand"
                disabled={isLoading}
                className="rounded-2xl"
              >
                {isLoading
                  ? t("common.loading")
                  : t("dashboard.superAdmin.auditLogs.dialog.submit")}
              </Button>
            </div>
          </form>
        </F.Form>
      </D.DialogContent>
    </D.Dialog>
  );
};
