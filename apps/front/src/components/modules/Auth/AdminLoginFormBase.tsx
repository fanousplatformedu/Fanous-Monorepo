"use client";

import { TAdminLoginFormBaseProps, TFormValues } from "@/types/modules";
import { SubmitHandler, useForm } from "react-hook-form";
import { baseApi, headerAuthApi } from "@/lib/redux/api";
import { usePathname, useRouter } from "next/navigation";
import { FloatingPasswordField } from "@elements/floating-password-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { getApiErrorMessage } from "@/utils/function-helper";
import { adminLoginSchema } from "@/lib/validation/auth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { toast } from "sonner";

import AuthFormActions from "@modules/Auth/AuthFormAction";
import AuthPageFooter from "@modules/Auth/AuthPageFooter";
import AuthGlassCard from "@modules/Auth/authGlassCard";
import AuthPageBadge from "@modules/Auth/AuthPageBadge";

import * as FP from "@/utils/force-password";
import * as F from "@ui/form";
import * as C from "@ui/card";

const AdminLoginFormBase = <TMutationResult,>({
  title,
  footer,
  submit,
  badgeIcon,
  badgeText,
  redirectTo,
  description,
  badgeTone = "blue",
  getSuccessMessage,
}: TAdminLoginFormBaseProps<TMutationResult>) => {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const form = useForm<TFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<TFormValues> = async (values) => {
    try {
      const res = await submit(values);

      dispatch(
        baseApi.util.invalidateTags([
          { type: "Auth", id: "SESSION" },
          { type: "Me", id: "CURRENT" },
        ]),
      );

      const refetchAction = dispatch(
        headerAuthApi.endpoints.currentUserHeader.initiate(undefined, {
          forceRefetch: true,
        }),
      );

      let currentUser: {
        id: string;
        role: string;
        fullName?: string | null;
        avatarUrl?: string | null;
        email?: string | null;
        schoolId?: string | null;
        forcePasswordChange?: boolean | null;
      } | null = null;

      try {
        currentUser = await refetchAction.unwrap();
      } catch {
        currentUser = null;
      } finally {
        refetchAction.unsubscribe();
      }

      toast.success(
        getSuccessMessage?.(res) ??
          t("auth.loginSuccess", {}, "Logged in successfully."),
      );

      const mustForceChange = Boolean(
        currentUser &&
          FP.isAdminForcePasswordRole(currentUser.role) &&
          currentUser.forcePasswordChange,
      );

      if (mustForceChange && currentUser?.role) {
        FP.setForcePasswordFlow({
          role: currentUser.role,
          returnTo: redirectTo,
          loginPath: pathname,
        });

        form.reset();

        setTimeout(() => {
          router.refresh();
        }, 50);

        return;
      }

      FP.clearForcePasswordFlow();
      router.replace(redirectTo);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, t("common.errors.generic")));
    }
  };

  return (
    <>
      <AuthPageBadge icon={badgeIcon} text={badgeText} tone={badgeTone} />

      <AuthGlassCard>
        <C.CardHeader className="space-y-3 px-7 pt-8 text-center">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <C.CardTitle className="text-2xl font-bold text-foreground">
              {title}
            </C.CardTitle>
          </motion.div>

          <C.CardDescription className="text-sm leading-6 text-muted-foreground">
            {description}
          </C.CardDescription>
        </C.CardHeader>

        <C.CardContent className="px-7 pb-7">
          <F.Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FloatingInputField
                name="username"
                control={form.control}
                label={t("form.username")}
              />

              <FloatingPasswordField
                name="password"
                control={form.control}
                label={t("form.password")}
              />

              <AuthFormActions
                submitText={t("auth.login")}
                backText={t("auth.backToRoles")}
                loadingText={t("common.loading")}
                isLoading={form.formState.isSubmitting}
                onBack={() => router.push("/get-started")}
              />

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>
            </form>
          </F.Form>
        </C.CardContent>
      </AuthGlassCard>

      <AuthPageFooter text={footer} />
    </>
  );
};

export default AdminLoginFormBase;
