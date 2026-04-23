"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { counselorNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import CounselorReviewsPage from "@modules/Dashboard/Counselor/Reviews";

const CounselorReviewsDashboardPage = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.counselor.reviews.page.title")}
          description={t("dashboard.counselor.reviews.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          items={counselorNav}
          title={t("dashboard.counselor.shell.title")}
          subtitle={t("dashboard.counselor.shell.subtitle")}
        />
      }
    >
      <Background />
      <CounselorReviewsPage />
    </DashboardShell>
  );
};

export default CounselorReviewsDashboardPage;
