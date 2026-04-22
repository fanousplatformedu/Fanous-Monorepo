"use client";

import { useSubmitAccessRequestMutation } from "@/lib/redux/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePublicSchoolsQuery } from "@/lib/redux/api/endpoints/public.api";
import { accessRequestSchema } from "@/lib/validation/auth-schemas";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { Button } from "@ui/button";
import { toast } from "sonner";
import { z } from "zod";

import AuthPageFooter from "@modules/Auth/AuthPageFooter";
import AuthPageShell from "@modules/Auth/AuthPageShell";
import AuthPageBadge from "@modules/Auth/AuthPageBadge";
import AuthGlassCard from "@modules/Auth/authGlassCard";

import * as C from "@ui/card";
import * as F from "@ui/form";
import * as L from "lucide-react";

type FormValues = z.infer<typeof accessRequestSchema>;

const AccessRequestPage = () => {
  const { t } = useI18n();
  const [submitRequest, { isLoading }] = useSubmitAccessRequestMutation();

  const {
    data: schoolsData,
    isLoading: isSchoolsLoading,
    isError: isSchoolsError,
  } = usePublicSchoolsQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      schoolId: "",
      fullName: "",
      email: "",
      mobile: "",
      requestedRole: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await submitRequest({
        schoolId: values.schoolId,
        fullName: values.fullName.trim(),
        requestedRole: values.requestedRole,
        email: values.email.trim() || undefined,
        mobile: values.mobile.trim() || undefined,
      }).unwrap();
      toast.success(t("auth.accessRequest.success"));
      form.reset({
        schoolId: "",
        fullName: "",
        email: "",
        mobile: "",
        requestedRole: undefined,
      });
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message ===
          "string"
          ? (error as { data: { message?: string } }).data.message
          : error instanceof Error
            ? error.message
            : t("common.errors.generic");
      toast.error(message || t("common.errors.generic"));
    }
  };

  const schools = schoolsData?.items ?? [];

  return (
    <AuthPageShell contentClassName="max-w-2xl">
      <Background />
      <AuthPageBadge
        icon={L.UserRoundPlus}
        tone="amber"
        text={t("auth.accessRequest.badge")}
      />

      <AuthGlassCard>
        <C.CardHeader className="space-y-3 px-7 pt-8 text-center">
          <C.CardTitle className="text-2xl font-bold">
            {t("auth.accessRequest.title")}
          </C.CardTitle>
          <C.CardDescription className="text-sm leading-6 text-muted-foreground">
            {t("auth.accessRequest.description")}
          </C.CardDescription>
        </C.CardHeader>

        <C.CardContent className="px-7 pb-7">
          <F.Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-5 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <FloatingSelectField
                  control={form.control}
                  name="schoolId"
                  label={t("form.school")}
                  disabled={isSchoolsLoading || schools.length === 0}
                  options={schools.map((school) => ({
                    value: school.id,
                    label: school.name,
                  }))}
                />
              </div>

              <div className="md:col-span-2">
                <FloatingInputField
                  name="fullName"
                  control={form.control}
                  label={t("form.fullName")}
                />
              </div>

              <FloatingInputField
                name="mobile"
                control={form.control}
                label={t("form.mobile")}
              />

              <FloatingInputField
                name="email"
                type="email"
                control={form.control}
                label={t("form.email")}
              />

              <div className="md:col-span-2">
                <FloatingSelectField
                  control={form.control}
                  name="requestedRole"
                  label={t("form.role")}
                  options={[
                    { value: "PARENT", label: t("roles.parent") },
                    { value: "STUDENT", label: t("roles.student") },
                    { value: "COUNSELOR", label: t("roles.counselor") },
                  ]}
                />
              </div>

              {isSchoolsError && (
                <div className="md:col-span-2 text-sm text-destructive">
                  {t("auth.accessRequest.schoolLoadError")}
                </div>
              )}

              <div className="md:col-span-2 pt-1">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] text-white shadow-[0_10px_30px_rgba(59,130,246,0.20)] dark:bg-[linear-gradient(135deg,rgba(243,226,199,1),rgba(200,170,130,0.92))] dark:text-[#2a2018]"
                    disabled={
                      isLoading || isSchoolsLoading || schools.length === 0
                    }
                  >
                    {isLoading
                      ? t("common.loading")
                      : t("auth.accessRequest.submit")}
                  </Button>
                </motion.div>
              </div>
            </form>
          </F.Form>
        </C.CardContent>
      </AuthGlassCard>
      <AuthPageFooter text={t("auth.accessRequest.footer")} />
    </AuthPageShell>
  );
};

export default AccessRequestPage;
