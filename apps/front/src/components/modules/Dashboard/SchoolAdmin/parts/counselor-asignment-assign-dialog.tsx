"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TAssignAssignmentsDialog } from "@/types/modules";
import { TAssignAssignmentsValues } from "@/lib/validation/school-admin-schemas";
import { assignAssignmentsSchema } from "@/lib/validation/school-admin-schemas";
import { FloatingSelectField } from "@elements/floating-select-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const CounselorAssignmentsAssignDialog = ({
  open,
  isLoading,
  onSubmit,
  onOpenChange,
  studentOptions,
  counselorOptions,
}: TAssignAssignmentsDialog) => {
  const { t } = useI18n();

  const form = useForm<TAssignAssignmentsValues>({
    resolver: zodResolver(assignAssignmentsSchema),
    defaultValues: {
      counselorId: "",
      studentIds: [],
    },
  });

  const selectedStudentIds = form.watch("studentIds");

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          form.reset({
            counselorId: "",
            studentIds: [],
          });
        }
      }}
      title={t("dashboard.schoolAdmin.counselorAssignments.assignDialog.title")}
      description={t(
        "dashboard.schoolAdmin.counselorAssignments.assignDialog.description",
      )}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isLoading}
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          form="assign-counselor-students-form"
          onCancel={() => onOpenChange(false)}
          confirmText={t(
            "dashboard.schoolAdmin.counselorAssignments.assignDialog.submit",
          )}
        />
      }
    >
      <F.Form {...form}>
        <form
          className="space-y-5"
          id="assign-counselor-students-form"
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
        >
          <FloatingSelectField
            name="counselorId"
            control={form.control}
            options={counselorOptions}
            label={t(
              "dashboard.schoolAdmin.counselorAssignments.assignDialog.fields.counselor",
            )}
          />

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t(
                  "dashboard.schoolAdmin.counselorAssignments.assignDialog.fields.students",
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(
                  "dashboard.schoolAdmin.counselorAssignments.assignDialog.fields.studentsHint",
                )}
              </p>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-border/60 bg-card/40 p-3">
              {studentOptions.map((student) => {
                const checked = selectedStudentIds.includes(student.value);

                return (
                  <button
                    key={student.value}
                    type="button"
                    onClick={() => {
                      const current = form.getValues("studentIds");
                      const exists = current.includes(student.value);

                      form.setValue(
                        "studentIds",
                        exists
                          ? current.filter((id) => id !== student.value)
                          : [...current, student.value],
                        { shouldValidate: true },
                      );
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      checked
                        ? "border-primary/30 bg-primary/10"
                        : "border-border/50 bg-secondary/10"
                    }`}
                  >
                    <span className="text-sm font-medium">{student.label}</span>
                    {checked ? (
                      <span className="text-xs font-semibold text-primary">
                        {t("common.selected")}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <F.FormField
              name="studentIds"
              control={form.control}
              render={() => <F.FormMessage className="text-xs" />}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="brandSoft"
              className="rounded-2xl"
              onClick={() => form.setValue("studentIds", [])}
            >
              {t(
                "dashboard.schoolAdmin.counselorAssignments.assignDialog.clearSelection",
              )}
            </Button>
          </div>
        </form>
      </F.Form>
    </AppDialog>
  );
};
