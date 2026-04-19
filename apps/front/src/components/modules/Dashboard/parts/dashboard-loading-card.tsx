import { TDashboardLoadingCardProps } from "@/types/elements";

export const DashboardLoadingCard = ({
  rows = 5,
  title = true,
}: TDashboardLoadingCardProps) => {
  return (
    <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 backdrop-blur-2xl">
      {title ? (
        <div className="mb-5 h-6 w-48 animate-pulse rounded-xl bg-muted/50" />
      ) : null}

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-2xl bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
};
