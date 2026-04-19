"use client";

import { TAccessRequestRole, TDialogFormValues } from "@/types/modules";
import { TAccessRequestReviewDialogProps } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";

import * as F from "@ui/form";

const ACCESS_REQUEST_DIALOG_FORM_ID = "access-request-review-form";

export const AccessRequestDialog = ({
  open,
  mode,
  request,
  isLoading,
  onConfirm,
  onOpenChange,
}: TAccessRequestReviewDialogProps) => {
  const { t } = useI18n();

  const form = useForm<TDialogFormValues>({
    defaultValues: {
      finalRole: "STUDENT",
      rejectReason: "",
    },
  });

  useEffect(() => {
    if (!request || !mode) return;

    form.reset({
      finalRole: request.requestedRole,
      rejectReason: "",
    });
  }, [form, mode, request]);

  const roleOptions: Array<{ value: TAccessRequestRole; label: string }> = [
    {
      value: "STUDENT",
      label: t("dashboard.schoolAdmin.accessRequests.roles.STUDENT"),
    },
    {
      value: "PARENT",
      label: t("dashboard.schoolAdmin.accessRequests.roles.PARENT"),
    },
    {
      value: "COUNSELOR",
      label: t("dashboard.schoolAdmin.accessRequests.roles.COUNSELOR"),
    },
  ];

  const handleSubmit = async (values: TDialogFormValues) => {
    if (mode === "approve") {
      await onConfirm({
        finalRole: values.finalRole,
      });
      return;
    }

    await onConfirm({
      rejectReason: values.rejectReason,
    });
  };

  return (
    <AppDialog
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "approve"
          ? t("dashboard.schoolAdmin.accessRequests.dialog.approve.title")
          : t("dashboard.schoolAdmin.accessRequests.dialog.reject.title")
      }
      description={
        mode === "approve"
          ? t("dashboard.schoolAdmin.accessRequests.dialog.approve.description")
          : t("dashboard.schoolAdmin.accessRequests.dialog.reject.description")
      }
      footer={
        <AppDialogActions
          cancelText={t("common.cancel")}
          confirmText={
            mode === "approve"
              ? t("dashboard.schoolAdmin.accessRequests.actions.approve")
              : t("dashboard.schoolAdmin.accessRequests.actions.reject")
          }
          loadingText={t("common.loading")}
          isLoading={isLoading}
          confirmType="submit"
          form={ACCESS_REQUEST_DIALOG_FORM_ID}
          confirmVariant={mode === "approve" ? "brand" : "brandSoft"}
          onCancel={() => onOpenChange(false)}
        />
      }
    >
      <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm">
        <p>
          <span className="font-medium">
            {t("dashboard.schoolAdmin.accessRequests.dialog.common.fullName")}:
          </span>{" "}
          {request?.fullName || "-"}
        </p>

        <p className="mt-2">
          <span className="font-medium">
            {t(
              "dashboard.schoolAdmin.accessRequests.dialog.common.requestedRole",
            )}
            :
          </span>{" "}
          {request
            ? t(
                `dashboard.schoolAdmin.accessRequests.roles.${request.requestedRole}`,
              )
            : "-"}
        </p>

        <p className="mt-2">
          <span className="font-medium">
            {t("dashboard.schoolAdmin.accessRequests.dialog.common.email")}:
          </span>{" "}
          {request?.email || "-"}
        </p>
      </div>

      <F.Form {...form}>
        <form
          id={ACCESS_REQUEST_DIALOG_FORM_ID}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {mode === "approve" ? (
            <FloatingSelectField
              name="finalRole"
              control={form.control}
              label={t(
                "dashboard.schoolAdmin.accessRequests.dialog.approve.finalRole",
              )}
              options={roleOptions}
            />
          ) : null}

          {mode === "reject" ? (
            <FloatingInputField
              name="rejectReason"
              control={form.control}
              label={t(
                "dashboard.schoolAdmin.accessRequests.dialog.reject.reason",
              )}
            />
          ) : null}
        </form>
      </F.Form>
    </AppDialog>
  );
};
