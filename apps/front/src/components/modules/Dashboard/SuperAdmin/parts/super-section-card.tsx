import { TSuperAdminSectionCardProps } from "@/types/elements";

export const SuperAdminSectionCard = ({
  title,
  description,
  action,
  children,
}: TSuperAdminSectionCardProps) => {
  return (
    <section className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>

      {children}
    </section>
  );
};
