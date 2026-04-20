"use client";

import { useI18n } from "@/hooks/useI18n";

import type * as TAPI from "@/lib/graphql/generated";

import * as L from "lucide-react";

type TMe = TAPI.SchoolUserMeQuery["me"];

export const ParentAccountCard = ({ me }: { me: TMe }) => {
  const { t } = useI18n();

  const rows = [
    {
      icon: L.UserRound,
      label: t("dashboard.parent.profile.accountCard.rows.role"),
      value: t("dashboard.parent.profile.accountCard.values.parent"),
    },
    {
      icon: L.Mail,
      label: t("dashboard.parent.profile.accountCard.rows.email"),
      value: me.email || t("dashboard.parent.profile.common.notSet"),
    },
    {
      icon: L.Phone,
      label: t("dashboard.parent.profile.accountCard.rows.mobile"),
      value: me.mobile || t("dashboard.parent.profile.common.notSet"),
    },
    {
      icon: L.BadgeCheck,
      label: t("dashboard.parent.profile.accountCard.rows.status"),
      value: t("dashboard.parent.profile.accountCard.values.active"),
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const Icon = row.icon;

        return (
          <div
            key={row.label}
            className="rounded-2xl border border-border/50 bg-secondary/20 p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              {row.label}
            </div>

            <p className="text-sm font-semibold text-foreground break-words">
              {row.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};
