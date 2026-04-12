"use client";

import { TAuthPageBadgeProps } from "@/types/modules";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const toneMap = {
  blue: "text-blue-600 bg-blue-500/10 dark:text-[var(--primary)] dark:bg-white/8",
  green:
    "text-emerald-600 bg-emerald-500/10 dark:text-[var(--primary)] dark:bg-white/8",
  amber:
    "text-amber-600 bg-amber-500/10 dark:text-[var(--primary)] dark:bg-white/8",
};

const AuthPageBadge = ({
  icon: Icon,
  text,
  tone = "blue",
}: TAuthPageBadgeProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.96 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
      }}
      className="mb-5 flex items-center justify-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-3 py-2 backdrop-blur-xl">
        <div className={cn("rounded-full p-1.5", toneMap[tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {text}
        </span>
      </div>
    </motion.div>
  );
};

export default AuthPageBadge;
