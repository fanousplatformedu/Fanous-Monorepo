import { TDashboardEmptyStateProps } from "@/types/elements";

export const DashboardEmptyState = ({
  icon: Icon,
  title,
  description,
}: TDashboardEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border/60 bg-card/40 px-6 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-secondary/40 p-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
};
