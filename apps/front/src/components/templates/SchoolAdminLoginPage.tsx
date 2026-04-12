"use client";

import { useSchoolAdminLoginMutation } from "@/lib/redux/api";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import AdminLoginFormBase from "@modules/Auth/AdminLoginFormBase";
import AuthPageShell from "@modules/Auth/AuthPageShell";

import * as L from "lucide-react";

const SchoolAdminLoginPage = () => {
  const { t } = useI18n();
  const [login] = useSchoolAdminLoginMutation();

  return (
    <AuthPageShell>
      <Background />
      <AdminLoginFormBase
        badgeTone="green"
        badgeIcon={L.School}
        title={t("auth.schoolAdmin.title")}
        redirectTo="/school-admin/dashboard"
        footer={t("auth.schoolAdmin.footer")}
        badgeText={t("auth.schoolAdmin.badge")}
        submit={(values) => login(values).unwrap()}
        getSuccessMessage={(result) => result.message}
        description={t("auth.schoolAdmin.description")}
      />
    </AuthPageShell>
  );
};

export default SchoolAdminLoginPage;
