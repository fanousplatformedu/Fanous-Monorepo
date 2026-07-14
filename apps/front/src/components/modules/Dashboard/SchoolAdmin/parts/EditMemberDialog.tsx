"use client";

import {
  createEditSchoolMemberSchema,
  TEditSchoolMemberForm,
} from "@/lib/validation/school-admin-schemas";
import { useEditSchoolUserMutation, useSchoolMemberQuery } from "@/lib/redux/api";
import {
  generateFunUsername,
  generateRandomPassword,
  getApiErrorMessage,
} from "@/utils/function-helper";
import { FloatingInputField } from "@elements/floating-input-field";
import { FloatingSelectField } from "@elements/floating-select-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Switch } from "@ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { EditSchoolUserInput } from "@lib/graphql/generated";
import type { TSchoolMemberRow } from "@/types/modules";

import * as D from "@ui/dialog";
import * as F from "@ui/form";
import * as L from "lucide-react";

type TEditMemberDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
  member: TSchoolMemberRow | null;
};

type TFetchedMember = {
  id: string;
  role: string | null;
  email: string | null;
  mobile: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  isActive: boolean | null;
  forcePasswordChange: boolean | null;
};

const createDefaultValues = (
  member: TFetchedMember | null,
): TEditSchoolMemberForm => ({
  userId: member?.id ?? "",
  firstName: member?.firstName ?? "",
  lastName: member?.lastName ?? "",
  email: member?.email ?? "",
  mobile: member?.mobile ?? "",
  username: member?.username ?? "",
  password: "",
  role:
    member?.role === "STUDENT" ||
    member?.role === "PARENT" ||
    member?.role === "COUNSELOR" ||
    member?.role === "SCHOOL_ADMIN"
      ? member.role
      : "STUDENT",
  isActive: Boolean(member?.isActive),
  forcePasswordChange: Boolean(member?.forcePasswordChange),
});

export default function EditMemberDialog({
  open,
  onOpenChange,
  onSuccess,
  member,
}: TEditMemberDialogProps) {
  const { t, dir, language } = useI18n();
  const isRtl = dir === "rtl";
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [editSchoolUser, { isLoading }] = useEditSchoolUserMutation();

  // Fetch the full member record (incl. username) from the singular query.
  // The `member` prop is only used to know *which* user to edit.
  const { data: fetchedMember } = useSchoolMemberQuery(
    { userId: member?.id ?? "" },
    { skip: !open || !member },
  );

  const translateValidation = useRef(
    (key: string, params?: Record<string, string>) =>
      t(`dashboard.schoolAdmin.members.editMember.validation.${key}`, params),
  );

  translateValidation.current = (key, params) =>
    t(`dashboard.schoolAdmin.members.editMember.validation.${key}`, params);

  const editSchoolMemberSchema = useMemo(
    () =>
      createEditSchoolMemberSchema((key, params) =>
        translateValidation.current(key, params),
      ),
    [],
  );

  const form = useForm<TEditSchoolMemberForm>({
    resolver: zodResolver(editSchoolMemberSchema),
    defaultValues: createDefaultValues(null),
  });

  useEffect(() => {
    const fields = Object.keys(form.formState.errors);
    if (!fields.length) return;
    void form.trigger(fields as Array<keyof TEditSchoolMemberForm>);
  }, [form, language]);

  const handleGeneratePassword = useCallback(() => {
    form.setValue("password", generateRandomPassword(), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form]);

  const handleGenerateUsername = useCallback(() => {
    form.setValue("username", generateFunUsername(), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form]);

  useEffect(() => {
    if (open) {
      form.reset(createDefaultValues(fetchedMember ?? null));
      setPasswordFocused(false);
    }
  }, [form, open, fetchedMember]);

  const roleOptions = (
    ["STUDENT", "PARENT", "COUNSELOR", "SCHOOL_ADMIN"] as const
  ).map((value) => ({
    value,
    label: t(`dashboard.schoolAdmin.members.roles.${value}`),
  }));

  const onSubmit = async (values: TEditSchoolMemberForm) => {
    if (!member) return;
    try {
      const payload: EditSchoolUserInput = {
        userId: member.id,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        mobile: values.mobile.trim(),
        role: values.role,
        isActive: Boolean(values.isActive),
        forcePasswordChange: Boolean(values.forcePasswordChange),
        ...(values?.username ? { username: values.username.trim() } : {}),
        ...(values.password ? { password: values.password } : {}),
      };

      await editSchoolUser(payload).unwrap();

      toast.success(t("dashboard.schoolAdmin.members.editMember.toasts.success"));
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.members.editMember.toasts.failed"),
        ),
      );
    }
  };

  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent
        className="rounded-[1.75rem] border-border/60 bg-card/90 backdrop-blur-2xl sm:max-w-xl p-8"
        dir={dir}
      >
        <D.DialogHeader className={isRtl ? "text-right" : "text-left"}>
          <D.DialogTitle className="flex items-center gap-2">
            <L.UserCog className="size-5 shrink-0 text-primary" />
            {t("dashboard.schoolAdmin.members.editMember.dialog.title")}
          </D.DialogTitle>
          <D.DialogDescription>
            {t("dashboard.schoolAdmin.members.editMember.dialog.description")}
          </D.DialogDescription>
        </D.DialogHeader>

        <F.Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FloatingInputField
                name="firstName"
                control={form.control}
                label={t("dashboard.schoolAdmin.members.editMember.fields.firstName")}
              />

              <FloatingInputField
                name="lastName"
                control={form.control}
                label={t("dashboard.schoolAdmin.members.editMember.fields.lastName")}
              />

              <FloatingInputField
                name="email"
                type="email"
                dir="ltr"
                control={form.control}
                label={t("dashboard.schoolAdmin.members.editMember.fields.email")}
              />

              <FloatingInputField
                name="mobile"
                dir="ltr"
                control={form.control}
                label={t("dashboard.schoolAdmin.members.editMember.fields.mobile")}
              />

              <div className="relative flex items-start gap-2 md:col-span-2">
                <div className="min-w-0 flex-1">
                  <FloatingInputField
                    name="username"
                    control={form.control}
                    label={t(
                      "dashboard.schoolAdmin.members.editMember.fields.username",
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="brandOutline"
                  className="h-14 shrink-0 rounded-2xl px-3"
                  onClick={handleGenerateUsername}
                  title={t(
                    "dashboard.schoolAdmin.members.editMember.actions.generateUsername",
                  )}
                  aria-label={t(
                    "dashboard.schoolAdmin.members.editMember.actions.generateUsername",
                  )}
                >
                  <L.RefreshCw className="size-4" />
                </Button>
              </div>

              <F.FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const hasValue = String(field.value ?? "").length > 0;
                  const passwordLabel = t(
                    "dashboard.schoolAdmin.members.editMember.fields.password",
                  );
                  const keepHint = t(
                    "dashboard.schoolAdmin.members.editMember.fields.passwordKeepHint",
                  );

                  return (
                    <F.FormItem className="relative md:col-span-2">
                      <div className="flex items-start gap-2">
                        <div className="relative min-w-0 flex-1">
                          <F.FormLabel
                            className={cn(
                              "pointer-events-none absolute start-4 z-10 transition-all duration-200",
                              passwordFocused || hasValue
                                ? "top-2 text-xs text-primary"
                                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
                            )}
                          >
                            {passwordLabel}
                          </F.FormLabel>

                              <F.FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              type="text"
                              autoComplete="new-password"
                              placeholder={passwordFocused || hasValue ? keepHint : undefined}
                              onFocus={() => setPasswordFocused(true)}
                              onBlur={() => {
                                setPasswordFocused(false);
                                field.onBlur();
                              }}
                              className={cn(
                                "h-14 rounded-2xl border border-border/60 bg-card/45 px-4 pb-2 pt-6 font-mono text-sm backdrop-blur-xl",
                                "focus:border-primary/30 focus:bg-card/65 focus:ring-0 focus-visible:ring-0",
                                "shadow-none focus-visible:shadow-[0_0_0_1px_rgba(59,130,246,0.08)] dark:focus-visible:shadow-[0_0_0_1px_rgba(243,226,199,0.10)]",
                              )}
                            />
                          </F.FormControl>
                        </div>

                        <Button
                          type="button"
                          variant="brandOutline"
                          className="h-14 shrink-0 rounded-2xl px-3"
                          onClick={handleGeneratePassword}
                          title={t(
                            "dashboard.schoolAdmin.members.editMember.actions.generatePassword",
                          )}
                          aria-label={t(
                            "dashboard.schoolAdmin.members.editMember.actions.generatePassword",
                          )}
                        >
                          <L.RefreshCw className="size-4" />
                        </Button>
                      </div>

                      <F.FormMessage className="mt-1 px-1 text-xs" />
                    </F.FormItem>
                  );
                }}
              />
            </div>

            <FloatingSelectField
              name="role"
              control={form.control}
              options={roleOptions}
              label={t("dashboard.schoolAdmin.members.editMember.fields.role")}
            />

            <div
              dir={dir}
              className="grid gap-3 rounded-2xl border border-border/50 bg-secondary/20 p-4 sm:grid-cols-2"
            >
              <F.FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <F.FormItem className="flex items-center gap-3 space-y-0">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                      <L.Power className="size-4" />
                    </span>
                    <F.FormLabel
                      className={`min-w-0 flex-1 text-sm font-medium leading-tight ${isRtl ? "text-right" : "text-left"}`}
                    >
                      {t(
                        "dashboard.schoolAdmin.members.editMember.fields.isActive",
                      )}
                    </F.FormLabel>
                    <F.FormControl>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                        className="shrink-0 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted-foreground/25"
                      />
                    </F.FormControl>
                  </F.FormItem>
                )}
              />

              <F.FormField
                control={form.control}
                name="forcePasswordChange"
                render={({ field }) => (
                  <F.FormItem className="flex items-center gap-3 space-y-0">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                      <L.KeyRound className="size-4" />
                    </span>
                    <F.FormLabel
                      className={`min-w-0 flex-1 text-sm font-medium leading-tight ${isRtl ? "text-right" : "text-left"}`}
                    >
                      {t(
                        "dashboard.schoolAdmin.members.editMember.fields.forcePasswordChange",
                      )}
                    </F.FormLabel>
                    <F.FormControl>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                        className="shrink-0 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted-foreground/25"
                      />
                    </F.FormControl>
                  </F.FormItem>
                )}
              />
            </div>

            <div
              className={`flex gap-3 pt-1 ${isRtl ? "flex-row-reverse" : "justify-end"}`}
            >
              <Button
                type="button"
                variant="brandSoft"
                className="rounded-2xl"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("dashboard.schoolAdmin.members.editMember.actions.cancel")}
              </Button>

              <Button
                type="submit"
                variant="brand"
                className="rounded-2xl gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      <L.Loader2 className="size-4" />
                    </motion.span>
                    {t("dashboard.schoolAdmin.members.editMember.actions.submitting")}
                  </>
                ) : (
                  <>
                    <L.Save className="size-4" />
                    {t("dashboard.schoolAdmin.members.editMember.actions.submit")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </F.Form>
      </D.DialogContent>
    </D.Dialog>
  );
}
