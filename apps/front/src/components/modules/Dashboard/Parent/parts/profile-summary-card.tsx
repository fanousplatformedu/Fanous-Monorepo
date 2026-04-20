"use client";

import { getInitials } from "@/utils/function-helper";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

import type * as TAPI from "@/lib/graphql/generated";
import * as L from "lucide-react";

type TMe = TAPI.SchoolUserMeQuery["me"];

export const ParentProfileSummaryCard = ({
  me,
  isFetching,
}: {
  me: TMe;
  isFetching?: boolean;
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-border/60 bg-secondary/30 text-xl font-bold text-foreground">
            {getInitials(me.fullName)}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              {me.fullName || t("dashboard.parent.profile.common.notSet")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.parent.profile.summaryCard.role")}
            </p>
            <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {t("dashboard.parent.profile.summaryCard.parentRole")}
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <L.Mail className="h-4 w-4 text-primary" />
              {t("dashboard.parent.profile.summaryCard.email")}
            </div>
            <p className="text-sm font-semibold text-foreground break-all">
              {me.email || t("dashboard.parent.profile.common.notSet")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <L.Phone className="h-4 w-4 text-primary" />
              {t("dashboard.parent.profile.summaryCard.mobile")}
            </div>
            <p className="text-sm font-semibold text-foreground">
              {me.mobile || t("dashboard.parent.profile.common.notSet")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4 sm:col-span-2 xl:col-span-1">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <L.RefreshCw
                className={cn(
                  "h-4 w-4 text-primary",
                  isFetching && "animate-spin",
                )}
              />
              {t("dashboard.parent.profile.summaryCard.status")}
            </div>
            <p className="text-sm font-semibold text-foreground">
              {isFetching
                ? t("common.refreshing")
                : t("dashboard.parent.profile.summaryCard.synced")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
