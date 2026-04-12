"use client";

import { SuperAdminRequestBarChart } from "@elements/super-admin-charts";
import { SuperAdminStatusPieChart } from "@elements/super-admin-charts";
import { SuperAdminSectionCard } from "@elements/super-admin-section-card";
import { SuperAdminKpiCard } from "@elements/super-admin-kpi-card";
import { TrendWidget } from "@elements/trend-wighet";
import { useI18n } from "@/hooks/useI18n";

import * as API from "@/lib/redux/api";
import * as L from "lucide-react";

const SuperAdminOverview = () => {
  const { t } = useI18n();

  const { data: schoolsData } = API.useSchoolsQuery({ take: 200, skip: 0 });
  const { data: adminsData } = API.useSchoolAdminsQuery({ take: 200, skip: 0 });
  const { data: requestsData } = API.useSuperAdminAccessRequestsQuery({
    take: 200,
    skip: 0,
  });
  const { data: auditData } = API.useSuperAdminAuditLogsQuery({
    take: 200,
    skip: 0,
  });

  const schools = schoolsData?.items ?? [];
  const admins = adminsData?.items ?? [];
  const requests = requestsData?.items ?? [];

  const activeSchools = schools.filter((s) => s.status === "ACTIVE").length;
  const suspendedSchools = schools.filter(
    (s) => s.status === "SUSPENDED",
  ).length;
  const archivedSchools = schools.filter((s) => s.status === "ARCHIVED").length;

  const activeAdmins = admins.filter((a) => a.status === "ACTIVE").length;
  const disabledAdmins = admins.filter((a) => a.status === "DISABLED").length;

  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter(
    (r) => r.status === "APPROVED",
  ).length;
  const rejectedRequests = requests.filter(
    (r) => r.status === "REJECTED",
  ).length;

  const schoolStatusData = [
    { name: t("dashboard.superAdmin.status.active"), value: activeSchools },
    {
      name: t("dashboard.superAdmin.status.suspended"),
      value: suspendedSchools,
    },
    { name: t("dashboard.superAdmin.status.archived"), value: archivedSchools },
  ];

  const requestStatusData = [
    {
      name: t("dashboard.superAdmin.requests.pending"),
      value: pendingRequests,
    },
    {
      name: t("dashboard.superAdmin.requests.approved"),
      value: approvedRequests,
    },
    {
      name: t("dashboard.superAdmin.requests.rejected"),
      value: rejectedRequests,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SuperAdminKpiCard
          icon={L.School}
          value={schoolsData?.total ?? 0}
          title={t("dashboard.superAdmin.kpi.totalSchools")}
        />
        <SuperAdminKpiCard
          icon={L.UserCog}
          value={adminsData?.total ?? 0}
          title={t("dashboard.superAdmin.kpi.schoolAdmins")}
        />
        <SuperAdminKpiCard
          icon={L.UserPlus2}
          value={pendingRequests}
          title={t("dashboard.superAdmin.kpi.pendingRequests")}
        />
        <SuperAdminKpiCard
          icon={L.ScrollText}
          value={auditData?.total ?? 0}
          title={t("dashboard.superAdmin.kpi.auditLogs")}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.sections.schoolStatus.title")}
          description={t(
            "dashboard.superAdmin.sections.schoolStatus.description",
          )}
        >
          <SuperAdminStatusPieChart data={schoolStatusData} />
        </SuperAdminSectionCard>

        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.sections.accessRequests.title")}
          description={t(
            "dashboard.superAdmin.sections.accessRequests.description",
          )}
        >
          <SuperAdminRequestBarChart data={requestStatusData} />
        </SuperAdminSectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SuperAdminKpiCard
          icon={L.BadgeCheck}
          value={activeSchools}
          title={t("dashboard.superAdmin.kpi.activeSchools")}
        />
        <SuperAdminKpiCard
          icon={L.ShieldAlert}
          value={suspendedSchools}
          title={t("dashboard.superAdmin.kpi.suspendedSchools")}
        />
        <SuperAdminKpiCard
          icon={L.UserCheck}
          value={activeAdmins}
          title={t("dashboard.superAdmin.kpi.activeAdmins")}
        />
        <SuperAdminKpiCard
          icon={L.UserX}
          value={disabledAdmins}
          title={t("dashboard.superAdmin.kpi.disabledAdmins")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TrendWidget
          value={approvedRequests}
          title={t("dashboard.superAdmin.trends.approvedRequests")}
          hint={t("dashboard.superAdmin.trends.approvedRequestsHint")}
        />
        <TrendWidget
          value={rejectedRequests}
          title={t("dashboard.superAdmin.trends.rejectedRequests")}
          hint={t("dashboard.superAdmin.trends.rejectedRequestsHint")}
        />
        <TrendWidget
          value={archivedSchools}
          title={t("dashboard.superAdmin.trends.archivedSchools")}
          hint={t("dashboard.superAdmin.trends.archivedSchoolsHint")}
        />
      </div>
    </div>
  );
};

export default SuperAdminOverview;
