"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { Background } from "@elements/background";
import { studentNav } from "@/utils/dashboard-nav.config";
import { useI18n } from "@/hooks/useI18n";

import StudentResultsPage from "@modules/Dashboard/Student/Results";

const StudentResultsDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.student.results.page.title")}
          description={t("dashboard.student.results.page.description")}
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
      <StudentResultsPage />
    </DashboardShell>
  );
};

export default StudentResultsDashboard;
