"use client";

import { requestOtpSchema, verifyOtpSchema } from "@/lib/validation/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePublicSchoolsQuery } from "@/lib/redux/api";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { useMemo, useState } from "react";
import { mapEmailOrMobile } from "@/utils/function-helper";
import { useAppDispatch } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Background } from "@elements/background";
import { useRouter } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";
import { z } from "zod";

import * as API from "@/lib/redux/api";
import * as C from "@ui/card";
import * as F from "@ui/form";
import * as L from "lucide-react";

import AuthPageFooter from "@modules/Auth/AuthPageFooter";
import AuthGlassCard from "@modules/Auth/authGlassCard";
import AuthPageShell from "@modules/Auth/AuthPageShell";
import AuthPageBadge from "@modules/Auth/AuthPageBadge";
import OtpFlipCard from "@modules/Auth/OtpFlipCard";

type RequestValues = z.infer<typeof requestOtpSchema>;
type VerifyValues = z.infer<typeof verifyOtpSchema>;

const OtpLoginPage = () => {
  const { t } = useI18n();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [flipped, setFlipped] = useState(false);

  const [requestOtp, { isLoading: requesting }] = API.useRequestOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = API.useVerifyOtpMutation();

  const {
    data: schoolsData,
    isLoading: isSchoolsLoading,
    isError: isSchoolsError,
  } = usePublicSchoolsQuery();

  const availableSchools = useMemo(
    () => (schoolsData?.items ?? []).filter((school) => Boolean(school.code)),
    [schoolsData],
  );

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: {
      schoolCode: "",
      emailOrMobile: "",
    },
  });

  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      schoolCode: "",
      emailOrMobile: "",
      code: "",
    },
  });

  const onRequest: SubmitHandler<RequestValues> = async (values) => {
    try {
      const identityPayload = mapEmailOrMobile(values.emailOrMobile);
      await requestOtp({
        ...identityPayload,
        schoolCode: values.schoolCode,
      }).unwrap();
      verifyForm.setValue("emailOrMobile", values.emailOrMobile);
      verifyForm.setValue("schoolCode", values.schoolCode);
      toast.success(t("auth.otp.sent"));
      setFlipped(true);
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

  const onVerify: SubmitHandler<VerifyValues> = async (values) => {
    try {
      const identityPayload = mapEmailOrMobile(values.emailOrMobile);
      const res = await verifyOtp({
        ...identityPayload,
        code: values.code,
        schoolCode: values.schoolCode,
      }).unwrap();
      dispatch(
        API.baseApi.util.invalidateTags([
          { type: "Auth", id: "SESSION" },
          { type: "Me", id: "CURRENT" },
        ]),
      );
      const refetchAction = dispatch(
        API.headerAuthApi.endpoints.currentUserHeader.initiate(undefined, {
          forceRefetch: true,
        }),
      );
      try {
        await refetchAction.unwrap();
      } catch {}
      refetchAction.unsubscribe();
      toast.success(res.message);
      router.replace("/student/dashboard");
      router.refresh();
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

  const schoolOptions = availableSchools.map((school) => ({
    value: school.code as string,
    label: school.name,
  }));

  const cardFront = (
    <AuthGlassCard className="min-h-[540px]">
      <C.CardHeader className="space-y-3 px-7 pt-8 text-center">
        <C.CardTitle className="text-2xl font-bold">
          {t("auth.otp.requestTitle")}
        </C.CardTitle>
        <C.CardDescription className="text-sm leading-6 text-muted-foreground">
          {t("auth.otp.requestDescription")}
        </C.CardDescription>
      </C.CardHeader>
      <C.CardContent className="px-7 pb-7">
        <F.Form {...requestForm}>
          <form
            onSubmit={requestForm.handleSubmit(onRequest)}
            className="space-y-5"
          >
            <FloatingSelectField
              name="schoolCode"
              options={schoolOptions}
              label={t("form.school")}
              control={requestForm.control}
              disabled={isSchoolsLoading || schoolOptions.length === 0}
            />

            <FloatingInputField
              name="emailOrMobile"
              control={requestForm.control}
              label={t("form.emailOrMobile")}
            />

            {isSchoolsError && (
              <div className="text-sm text-destructive">
                {t("auth.otp.schoolLoadError")}
              </div>
            )}

            {!isSchoolsLoading && schoolOptions.length === 0 && (
              <div className="text-sm text-destructive">
                {t("auth.otp.noSchoolAvailable")}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/get-started")}
                className="h-12 flex-1 rounded-2xl border-border/60 bg-card/40"
              >
                <L.ChevronLeft className="mr-1 h-4 w-4" />
                {t("auth.backToRoles")}
              </Button>
              <Button
                type="submit"
                className="h-12 flex-1 rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] text-white shadow-[0_10px_30px_rgba(59,130,246,0.20)] dark:bg-[linear-gradient(135deg,rgba(243,226,199,1),rgba(200,170,130,0.92))] dark:text-[#2a2018]"
                disabled={
                  requesting || isSchoolsLoading || schoolOptions.length === 0
                }
              >
                {requesting ? (
                  <>
                    <L.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  <>
                    {t("auth.otp.sendCode")}
                    <L.ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </F.Form>
      </C.CardContent>
    </AuthGlassCard>
  );

  const cardBack = (
    <AuthGlassCard className="min-h-[540px]">
      <C.CardHeader className="space-y-3 px-7 pt-8 text-center">
        <C.CardTitle className="text-2xl font-bold">
          {t("auth.otp.verifyTitle")}
        </C.CardTitle>
        <C.CardDescription className="text-sm leading-6 text-muted-foreground">
          {t("auth.otp.verifyDescription")}
        </C.CardDescription>
      </C.CardHeader>

      <C.CardContent className="px-7 pb-7">
        <F.Form {...verifyForm}>
          <form
            onSubmit={verifyForm.handleSubmit(onVerify)}
            className="space-y-5"
          >
            <FloatingSelectField
              control={verifyForm.control}
              name="schoolCode"
              label={t("form.school")}
              disabled={isSchoolsLoading || schoolOptions.length === 0}
              options={schoolOptions}
            />

            <FloatingInputField
              control={verifyForm.control}
              name="emailOrMobile"
              label={t("form.emailOrMobile")}
            />

            <FloatingInputField
              control={verifyForm.control}
              name="code"
              label={t("form.otp")}
            />

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFlipped(false)}
                className="h-12 flex-1 rounded-2xl border-border/60 bg-card/40"
              >
                <L.ChevronLeft className="mr-1 h-4 w-4" />
                {t("common.back")}
              </Button>

              <Button
                type="submit"
                className="h-12 flex-1 rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] text-white shadow-[0_10px_30px_rgba(59,130,246,0.20)] dark:bg-[linear-gradient(135deg,rgba(243,226,199,1),rgba(200,170,130,0.92))] dark:text-[#2a2018]"
                disabled={
                  verifying || isSchoolsLoading || schoolOptions.length === 0
                }
              >
                {verifying ? (
                  <>
                    <L.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  <>
                    {t("auth.otp.verify")}
                    <L.ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </F.Form>
      </C.CardContent>
    </AuthGlassCard>
  );

  return (
    <AuthPageShell contentClassName="max-w-lg">
      <Background />
      <AuthPageBadge icon={L.KeyRound} tone="blue" text={t("auth.otp.badge")} />
      <OtpFlipCard flipped={flipped} front={cardFront} back={cardBack} />
      <AuthPageFooter text={t("auth.otp.footer")} />
    </AuthPageShell>
  );
};

export default OtpLoginPage;
