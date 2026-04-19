"use client";

import { TStudentNotificationFilterValues } from "@/types/modules";
import { StudentNotificationDetailDialog } from "@modules/Dashboard/Student/parts/notification-detail-dialog";
import { StudentNotificationFilters } from "@modules/Dashboard/Student/parts/notification-filter";
import { StudentNotificationTable } from "@modules/Dashboard/Student/parts/notification-table";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as TAPI from "@/lib/redux/api/endpoints/student.api";
import * as L from "lucide-react";

const defaultFilters: TStudentNotificationFilterValues = {
  unreadOnly: "ALL",
};

const StudentNotificationsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] =
    useState<TStudentNotificationFilterValues>(defaultFilters);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = TAPI.useMyNotificationsQuery({
    take: PAGE_SIZE,
    skip,
    unreadOnly: filters.unreadOnly === "UNREAD",
  });

  const [markNotificationRead, { isLoading: isMarkingRead }] =
    TAPI.useMarkNotificationReadMutation();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const unreadCount = useMemo(
    () => items.filter((item) => !item.isRead).length,
    [items],
  );

  const readCount = useMemo(
    () => items.filter((item) => item.isRead).length,
    [items],
  );

  const selectedNotification = useMemo(
    () => items.find((item) => item.id === selectedNotificationId) ?? null,
    [items, selectedNotificationId],
  );

  const handleOpenDetail = async (notificationId: string) => {
    const current = items.find((item) => item.id === notificationId);
    setSelectedNotificationId(notificationId);
    if (current && !current.isRead) {
      try {
        await markNotificationRead({ notificationId }).unwrap();
      } catch (error: unknown) {
        toast.error(
          getApiErrorMessage(
            error,
            t("dashboard.student.notifications.toasts.markReadFailed"),
          ),
        );
      }
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await markNotificationRead({
        notificationId,
      }).unwrap();
      toast.success(
        response.message ||
          t("dashboard.student.notifications.toasts.markReadSuccess"),
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.student.notifications.toasts.markReadFailed"),
        ),
      );
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setSelectedNotificationId(null);
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardSection
            title={t("dashboard.student.notifications.kpis.total.title")}
            description={t(
              "dashboard.student.notifications.kpis.total.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">{total}</p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.notifications.kpis.unread.title")}
            description={t(
              "dashboard.student.notifications.kpis.unread.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">{unreadCount}</p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.notifications.kpis.read.title")}
            description={t(
              "dashboard.student.notifications.kpis.read.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">{readCount}</p>
          </DashboardSection>
        </div>

        <DashboardSection
          title={t("dashboard.student.notifications.filtersCard.title")}
          description={t(
            "dashboard.student.notifications.filtersCard.description",
          )}
        >
          <StudentNotificationFilters
            value={filters}
            onApply={(nextFilters) => {
              setPage(1);
              setFilters(nextFilters);
            }}
            onReset={() => {
              setPage(1);
              setFilters(defaultFilters);
            }}
          />
        </DashboardSection>

        {!items.length ? (
          <DashboardEmptyState
            icon={L.Bell}
            title={t("dashboard.student.notifications.empty.title")}
            description={t("dashboard.student.notifications.empty.description")}
          />
        ) : (
          <StudentNotificationTable
            page={page}
            items={items}
            total={total}
            onPageChange={setPage}
            isFetching={isFetching}
            isMarkingRead={isMarkingRead}
            onViewDetail={handleOpenDetail}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </div>

      <StudentNotificationDetailDialog
        notification={selectedNotification}
        onOpenChange={handleDialogOpenChange}
        open={Boolean(selectedNotificationId)}
      />
    </>
  );
};

export default StudentNotificationsPage;
