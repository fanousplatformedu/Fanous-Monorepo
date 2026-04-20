"use client";

import { TStudentResultCard } from "@/types/modules";

export const StudentResultMatchCard = ({
  title,
  score,
  description,
  fitReason,
}: TStudentResultCard) => {
  return (
    <div className="rounded-2xl border border-border/50 bg-secondary/15 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {score}%
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${Math.max(0, Math.min(100, score ?? 0))}%`,
          }}
        />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{description}</p>

      <div className="mt-3 rounded-xl bg-background/60 p-3">
        <p className="text-xs font-medium text-foreground/80">{fitReason}</p>
      </div>
    </div>
  );
};
