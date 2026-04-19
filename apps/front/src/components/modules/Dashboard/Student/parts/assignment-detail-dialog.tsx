"use client";

import { TAnswerFormValues, TAssignmentDialog } from "@/types/modules";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

import * as D from "@ui/dialog";
import * as F from "@ui/form";

export const StudentAssignmentDetailDialog = ({
  open,
  assignment,
  isLoading,
  isSubmitting,
  onOpenChange,
  onSubmitAnswers,
}: TAssignmentDialog) => {
  const { t } = useI18n();

  const form = useForm<TAnswerFormValues>({
    defaultValues: {
      answers: [],
    },
  });

  const isReadOnly = useMemo(() => {
    return (
      assignment?.status === "EVALUATED" || assignment?.status === "SUBMITTED"
    );
  }, [assignment?.status]);

  useEffect(() => {
    if (!assignment) return;
    form.reset({
      answers: assignment.questions.map((question) => ({
        questionNumber: question.questionNumber,
        value: question.answerValue ?? undefined,
      })),
    });
  }, [assignment, form]);

  const handleSubmit = async (values: TAnswerFormValues) => {
    const normalized = values.answers
      .filter((item) => typeof item.value === "number")
      .map((item) => ({
        questionNumber: item.questionNumber,
        value: Number(item.value),
      }));
    if (!assignment?.questions.length) return;
    if (normalized.length !== assignment.questions.length) {
      form.setError("answers", {
        type: "manual",
        message: t("dashboard.student.assignments.detail.validation.required"),
      });
      return;
    }
    await onSubmitAnswers(normalized);
  };

  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.75rem] border-border/60 bg-card/90 backdrop-blur-2xl sm:max-w-4xl">
        <D.DialogHeader>
          <D.DialogTitle>
            {t("dashboard.student.assignments.detail.title")}
          </D.DialogTitle>
          <D.DialogDescription>
            {t("dashboard.student.assignments.detail.description")}
          </D.DialogDescription>
        </D.DialogHeader>

        {isLoading ? (
          <DashboardLoadingCard rows={6} />
        ) : !assignment ? null : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.assignments.detail.summary.status")}
                </p>
                <p className="mt-2 font-semibold">
                  {t(
                    `dashboard.student.assignments.status.${assignment.status}`,
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.assignments.detail.summary.dueAt")}
                </p>
                <p className="mt-2 font-semibold">
                  {assignment.dueAt
                    ? new Date(assignment.dueAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.assignments.detail.summary.questions")}
                </p>
                <p className="mt-2 font-semibold">
                  {assignment.questions.length}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground">
                  {t(
                    "dashboard.student.assignments.detail.summary.assignmentId",
                  )}
                </p>
                <p className="mt-2 truncate font-semibold">
                  {assignment.assignmentId}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
              <h3 className="text-base font-semibold text-foreground">
                {assignment.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {assignment.description || "-"}
              </p>
            </div>

            <F.Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
              >
                <div className="space-y-4">
                  {assignment.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-border/60 bg-card/70 p-5"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.student.assignments.detail.questionLabel",
                            )}{" "}
                            {question.questionNumber}
                          </p>
                          <p className="mt-1 text-sm font-medium text-foreground">
                            {question.text}
                          </p>
                        </div>
                      </div>

                      <Controller
                        control={form.control}
                        name={`answers.${index}.value`}
                        render={({ field }) => (
                          <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <button
                                key={score}
                                type="button"
                                disabled={isReadOnly}
                                onClick={() => field.onChange(score)}
                                className={cn(
                                  "rounded-xl border border-border/60 px-3 py-3 text-sm transition",
                                  field.value === score
                                    ? "bg-primary/15 text-foreground"
                                    : "bg-card/50 text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
                                  isReadOnly && "cursor-not-allowed opacity-70",
                                )}
                              >
                                <div className="font-semibold">{score}</div>
                                <div className="text-[11px]">
                                  {t(
                                    `dashboard.student.assignments.detail.scale.${score}`,
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  ))}
                </div>

                {form.formState.errors.answers?.message ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.answers.message}
                  </p>
                ) : null}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="brandSoft"
                    className="rounded-2xl"
                    onClick={() => onOpenChange(false)}
                  >
                    {t("common.cancel")}
                  </Button>

                  {!isReadOnly ? (
                    <Button
                      type="submit"
                      variant="brand"
                      className="rounded-2xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? t("dashboard.student.assignments.actions.submitting")
                        : t("dashboard.student.assignments.actions.submit")}
                    </Button>
                  ) : (
                    <Button
                      disabled
                      type="button"
                      variant="brandChip"
                      className="rounded-2xl"
                    >
                      {t("dashboard.student.assignments.detail.readOnly")}
                    </Button>
                  )}
                </div>
              </form>
            </F.Form>
          </div>
        )}
      </D.DialogContent>
    </D.Dialog>
  );
};
