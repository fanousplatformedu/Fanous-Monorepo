import { TDashboardHeaderProps } from "@/types/elements";

export const DashboardHeader = ({
  title,
  description,
  rightSlot,
}: TDashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-border/60 bg-card/60 p-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};
