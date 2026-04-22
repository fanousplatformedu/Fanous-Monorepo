"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TCreateAuditLogDialogProps } from "@/types/modules";
import { useCreateAuditLogMutation } from "@/lib/redux/api";
import { TSuperAuditLogValues } from "@/lib/validation/super-admin-schemas";
import { superAuditLogSchema } from "@/lib/validation/super-admin-schemas";
import { FloatingInputField } from "@elements/floating-input-field";
import { getApiErrorMessage } from "@/utils/function-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import * as F from "@ui/form";

export const SuperAuditLogDialog = ({
  open,
  onOpenChange,
}: TCreateAuditLogDialogProps) => {
  const { t } = useI18n();
  const [createAuditLog, { isLoading }] = useCreateAuditLogMutation();

  const form = useForm<TSuperAuditLogValues>({
    resolver: zodResolver(superAuditLogSchema),
    defaultValues: {
      schoolId: "",
      action: "",
      entityType: "",
      entityId: "",
      metadata: "",
    },
  });

  const onSubmit = async (values: TSuperAuditLogValues) => {
    try {
      await createAuditLog({
        action: values.action.trim(),
        entityId: values.entityId?.trim() || undefined,
        schoolId: values.schoolId?.trim() || undefined,
        entityType: values.entityType?.trim() || undefined,
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
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.superAdmin.auditLogs.dialog.title")}
      description={t("dashboard.superAdmin.auditLogs.dialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isLoading}
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.superAdmin.auditLogs.dialog.submit")}
        />
      }
    >
      <F.Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FloatingInputField
            name="action"
            control={form.control}
            label={t("dashboard.superAdmin.auditLogs.dialog.fields.action")}
          />
          <FloatingInputField
            name="schoolId"
            control={form.control}
            label={t("dashboard.superAdmin.auditLogs.dialog.fields.schoolId")}
          />
          <FloatingInputField
            name="entityType"
            control={form.control}
            label={t("dashboard.superAdmin.auditLogs.dialog.fields.entityType")}
          />
          <FloatingInputField
            name="entityId"
            control={form.control}
            label={t("dashboard.superAdmin.auditLogs.dialog.fields.entityId")}
          />
          <FloatingInputField
            name="metadata"
            control={form.control}
            label={t("dashboard.superAdmin.auditLogs.dialog.fields.metadata")}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
