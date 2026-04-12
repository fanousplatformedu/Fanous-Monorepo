import { TDashboardSectionProps } from "@/types/modules";
import { cn } from "@/lib/utils";

export const DashboardSection = ({
  title,
  description,
  children,
  className,
}: TDashboardSectionProps) => {
  return (
    <section
      className={cn(
        "rounded-[1.75rem] border border-border/60 bg-card/65 p-5 backdrop-blur-2xl",
        className,
      )}
    >
      {title ? (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  );
};
