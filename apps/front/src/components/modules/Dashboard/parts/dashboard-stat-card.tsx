import { TDashboardStatCardProps } from "@/types/elements";
import { motion } from "framer-motion";

export const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
}: TDashboardStatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[1.75rem] border border-border/60 bg-card/65 p-5 backdrop-blur-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
          {subtitle ? (
            <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(147,197,253,0.10))] p-3 dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.14),rgba(200,170,130,0.08))]">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      </div>
    </motion.div>
  );
};
