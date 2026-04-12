import { TTrendWidgetProps } from "@/types/elements";

export const TrendWidget = ({ title, value, hint }: TTrendWidgetProps) => {
  return (
    <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
};
