"use client";

import { TOverviewLatestList } from "@/types/modules";

export const CounselorOverviewLatestList = ({
  items,
  emptyText,
}: TOverviewLatestList) => {
  if (!items.length)
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-border/50 bg-secondary/15 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {item.title}
              </p>

              {item.subtitle ? (
                <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">
                  {item.subtitle}
                </p>
              ) : null}

              {item.meta ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.meta}
                </p>
              ) : null}
            </div>

            {item.badge ? (
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                {item.badge}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
