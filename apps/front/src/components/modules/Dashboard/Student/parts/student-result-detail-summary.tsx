"use client";

import { TSummaryPoint } from "@/types/modules";

export const StudentResultDetailSummaryStrip = ({
  items,
}: {
  items: TSummaryPoint[];
}) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-border/60 bg-secondary/20 px-4 py-4"
          >
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              <span>{item.label}</span>
            </div>

            <p className="line-clamp-2 text-sm font-semibold text-foreground">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};
