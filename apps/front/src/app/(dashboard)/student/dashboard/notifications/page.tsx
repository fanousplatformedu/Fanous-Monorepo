"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { Background } from "@elements/background";
import { studentNav } from "@/utils/dashboard-nav.config";
import { useI18n } from "@/hooks/useI18n";

import StudentNotificationsPage from "@modules/Dashboard/Student/Notification";

const StudentNotificationsDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.student.notifications.page.title")}
          description={t("dashboard.student.notifications.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          items={studentNav}
          title={t("dashboard.student.shell.title")}
          subtitle={t("dashboard.student.shell.subtitle")}
        />
      }
    >
      <Background />
      <StudentNotificationsPage />
    </DashboardShell>
  );
};

export default StudentNotificationsDashboard;
