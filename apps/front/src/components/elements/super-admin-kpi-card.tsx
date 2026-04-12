import { TSuperAdminKpiCardProps } from "@/types/elements";
import { cn } from "@/lib/utils";

export const SuperAdminKpiCard = ({
  hint,
  title,
  value,
  className,
  icon: Icon,
}: TSuperAdminKpiCardProps) => {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
          {hint ? (
            <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,0.14),rgba(147,197,253,0.10))] text-primary dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.16),rgba(200,170,130,0.10))]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
