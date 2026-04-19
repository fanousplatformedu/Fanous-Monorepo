"use client";

import { TStudentNotificationDetailDialog } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { useI18n } from "@/hooks/useI18n";

export const StudentNotificationDetailDialog = ({
  open,
  notification,
  onOpenChange,
}: TStudentNotificationDetailDialog) => {
  const { t } = useI18n();

  const getTypeLabel = (type?: string | null) => {
    if (!type) return "-";
    return t(`dashboard.student.notifications.types.${type}`);
  };

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.student.notifications.detail.title")}
      description={t("dashboard.student.notifications.detail.description")}
      footer={
        <AppDialogActions
          confirmVariant="brand"
          cancelVariant="brandSoft"
          cancelText={t("common.close")}
          confirmText={t("common.close")}
          onCancel={() => onOpenChange(false)}
          onConfirm={() => onOpenChange(false)}
        />
      }
    >
      {!notification ? null : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.notifications.detail.fields.type")}
                </p>
                <p className="mt-1 font-medium">
                  {getTypeLabel(notification.type)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.notifications.detail.fields.status")}
                </p>
                <p className="mt-1 font-medium">
                  {notification.isRead
                    ? t("dashboard.student.notifications.status.read")
                    : t("dashboard.student.notifications.status.unread")}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.notifications.detail.fields.createdAt")}
                </p>
                <p className="mt-1 font-medium">
                  {notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.notifications.detail.fields.readAt")}
                </p>
                <p className="mt-1 font-medium">
                  {notification.readAt
                    ? new Date(notification.readAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.student.notifications.detail.fields.title")}
            </p>
            <p className="mt-1 text-base font-semibold">{notification.title}</p>

            <p className="mt-4 text-xs text-muted-foreground">
              {t("dashboard.student.notifications.detail.fields.message")}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
              {notification.body}
            </p>

            <p className="mt-4 text-xs text-muted-foreground">
              {t("dashboard.student.notifications.detail.fields.actionUrl")}
            </p>
            <p className="mt-1 break-all text-sm text-foreground/90">
              {notification.actionUrl || "-"}
            </p>
          </div>
        </div>
      )}
    </AppDialog>
  );
};
