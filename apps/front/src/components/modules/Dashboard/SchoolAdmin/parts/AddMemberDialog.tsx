"use client";

import {
  createAddSchoolMemberSchema,
  TAddSchoolMemberForm,
} from "@/lib/validation/school-admin-schemas";
import { useAddSchoolUserMutation } from "@/lib/redux/api";
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

import * as D from "@ui/dialog";
import * as F from "@ui/form";
import * as L from "lucide-react";

type TAddMemberDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
};

const createDefaultValues = (): TAddSchoolMemberForm => ({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  username: generateFunUsername(),
  password: generateRandomPassword(),
  role: "STUDENT",
  isActive: true,
  forcePasswordChange: true,
});

export default function AddMemberDialog({
  open,
  onOpenChange,
  onSuccess,
}: TAddMemberDialogProps) {
  const { t, dir, language } = useI18n();
  const isRtl = dir === "rtl";
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [addSchoolUser, { isLoading }] = useAddSchoolUserMutation();

  const translateValidation = useRef(
    (key: string, params?: Record<string, string>) =>
      t(`dashboard.schoolAdmin.members.addMember.validation.${key}`, params),
  );

  translateValidation.current = (key, params) =>
    t(`dashboard.schoolAdmin.members.addMember.validation.${key}`, params);

  const addSchoolMemberSchema = useMemo(
    () =>
      createAddSchoolMemberSchema((key, params) =>
        translateValidation.current(key, params),
      ),
    [],
  );

  const form = useForm<TAddSchoolMemberForm>({
    resolver: zodResolver(addSchoolMemberSchema),
    defaultValues: createDefaultValues(),
  });

  useEffect(() => {
    const fields = Object.keys(form.formState.errors);
    if (!fields.length) return;
    void form.trigger(fields as Array<keyof TAddSchoolMemberForm>);
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
      form.reset(createDefaultValues());
      setUsernameFocused(false);
      setPasswordFocused(false);
    }
  }, [form, open]);

  const roleOptions = (
    ["STUDENT", "PARENT", "COUNSELOR", "SCHOOL_ADMIN"] as const
  ).map((value) => ({
    value,
    label: t(`dashboard.schoolAdmin.members.roles.${value}`),
  }));

  const onSubmit = async (values: TAddSchoolMemberForm) => {
    try {
      await addSchoolUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        mobile: values.mobile.trim(),
        username: values.username.trim(),
        password: values.password,
        role: values.role,
        isActive: Boolean(values.isActive),
        forcePasswordChange: Boolean(values.forcePasswordChange),
      }).unwrap();

      toast.success(t("dashboard.schoolAdmin.members.addMember.toasts.success"));
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.members.addMember.toasts.failed"),
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
            <L.UserPlus className="size-5 shrink-0 text-primary" />
            {t("dashboard.schoolAdmin.members.addMember.dialog.title")}
          </D.DialogTitle>
          <D.DialogDescription>
            {t("dashboard.schoolAdmin.members.addMember.dialog.description")}
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
                label={t("dashboard.schoolAdmin.members.addMember.fields.firstName")}
              />

              <FloatingInputField
                name="lastName"
                control={form.control}
                label={t("dashboard.schoolAdmin.members.addMember.fields.lastName")}
              />

              <FloatingInputField
                name="email"
                type="email"
                control={form.control}
                label={t("dashboard.schoolAdmin.members.addMember.fields.email")}
              />

              <FloatingInputField
                name="mobile"
                control={form.control}
                label={t("dashboard.schoolAdmin.members.addMember.fields.mobile")}
              />

              <F.FormField
                control={form.control}
                name="username"
                render={({ field }) => {
                  const hasValue = String(field.value ?? "").length > 0;
                  const usernameLabel = t(
                    "dashboard.schoolAdmin.members.addMember.fields.username",
                  );

                  return (
                    <F.FormItem className="relative md:col-span-2">
                      <div className="flex items-start gap-2">
                        <div className="relative min-w-0 flex-1">
                          <F.FormLabel
                            className={cn(
                              "pointer-events-none absolute start-4 z-10 transition-all duration-200",
                              usernameFocused || hasValue
                                ? "top-2 text-xs text-primary"
                                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
                            )}
                          >
                            {usernameLabel}
                          </F.FormLabel>

                          <F.FormControl>
                            <Input
                              {...field}
                              type="text"
                              autoComplete="username"
                              onFocus={() => setUsernameFocused(true)}
                              onBlur={() => {
                                setUsernameFocused(false);
                                field.onBlur();
                              }}
                              className={cn(
                                "h-14 rounded-2xl border border-border/60 bg-card/45 px-4 pb-2 pt-6 text-sm backdrop-blur-xl",
                                "placeholder:text-transparent",
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
                          onClick={handleGenerateUsername}
                          title={t(
                            "dashboard.schoolAdmin.members.addMember.actions.generateUsername",
                          )}
                          aria-label={t(
                            "dashboard.schoolAdmin.members.addMember.actions.generateUsername",
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

              <F.FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const hasValue = String(field.value ?? "").length > 0;
                  const passwordLabel = t(
                    "dashboard.schoolAdmin.members.addMember.fields.password",
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
                              type="text"
                              autoComplete="new-password"
                              onFocus={() => setPasswordFocused(true)}
                              onBlur={() => {
                                setPasswordFocused(false);
                                field.onBlur();
                              }}
                              className={cn(
                                "h-14 rounded-2xl border border-border/60 bg-card/45 px-4 pb-2 pt-6 font-mono text-sm backdrop-blur-xl",
                                "placeholder:text-transparent",
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
                            "dashboard.schoolAdmin.members.addMember.actions.generatePassword",
                          )}
                          aria-label={t(
                            "dashboard.schoolAdmin.members.addMember.actions.generatePassword",
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
              label={t("dashboard.schoolAdmin.members.addMember.fields.role")}
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
                        "dashboard.schoolAdmin.members.addMember.fields.isActive",
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
                        "dashboard.schoolAdmin.members.addMember.fields.forcePasswordChange",
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
                {t("dashboard.schoolAdmin.members.addMember.actions.cancel")}
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
                    {t("dashboard.schoolAdmin.members.addMember.actions.submitting")}
                  </>
                ) : (
                  <>
                    <L.UserPlus className="size-4" />
                    {t("dashboard.schoolAdmin.members.addMember.actions.submit")}
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
