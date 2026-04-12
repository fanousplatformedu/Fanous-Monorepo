"use client";

import { useSuperAdminLoginMutation } from "@/lib/redux/api";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import AdminLoginFormBase from "@modules/Auth/AdminLoginFormBase";
import AuthPageShell from "@modules/Auth/AuthPageShell";

import * as L from "lucide-react";

const SuperAdminLoginPage = () => {
  const { t } = useI18n();
  const [login] = useSuperAdminLoginMutation();

  return (
    <AuthPageShell>
      <Background />
      <AdminLoginFormBase
        badgeTone="blue"
        badgeIcon={L.ShieldCheck}
        title={t("auth.superAdmin.title")}
        redirectTo="/super-admin/dashboard"
        footer={t("auth.superAdmin.footer")}
        badgeText={t("auth.superAdmin.badge")}
        submit={(values) => login(values).unwrap()}
        description={t("auth.superAdmin.description")}
        getSuccessMessage={(result) => result.message}
      />
    </AuthPageShell>
  );
};

export default SuperAdminLoginPage;
