"use client";

import { TStudentResultDetail } from "@/types/modules";
import { cn } from "@/lib/utils";

export const StudentResultDetailTabs = ({
  items,
  value,
  onChange,
}: TStudentResultDetail) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-2">
      <div
        className={`grid gap-2 ${items.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
      >
        {items.map((tab) => {
          const Icon = tab.icon;
          const isActive = value === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
