import { TLocalSummaryCardProps } from "@/types/modules";
import { cn } from "@/lib/utils";

export const LocalSummaryCard = ({
  title,
  value,
  icon: Icon,
  isFetching,
}: TLocalSummaryCardProps) => {
  return (
    <div className="rounded-[1.5rem] border border-border/60 bg-card/65 p-4 backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">
            {isFetching ? "..." : value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            "bg-secondary/40 text-primary",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
