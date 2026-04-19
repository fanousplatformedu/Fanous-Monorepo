"use client";

import { TResultDistribution } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";

export const StudentResultDominantDistribution = ({
  title,
  description,
  items,
  emptyText,
}: TResultDistribution) => {
  return (
    <DashboardSection title={title} description={description}>
      {!items.length ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
            >
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-primary">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
};
