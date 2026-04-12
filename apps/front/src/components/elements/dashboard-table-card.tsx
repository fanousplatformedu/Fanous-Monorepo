import { TDashboardTableCardProps } from "@/types/elements";

export const DashboardTableCard = ({
  title,
  description,
  children,
}: TDashboardTableCardProps) => {
  return (
    <div className="rounded-[1.75rem] border border-border/60 bg-card/65 p-5 backdrop-blur-2xl">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50">
        {children}
      </div>
    </div>
  );
};
