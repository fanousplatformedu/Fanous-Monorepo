"use client";

import { TDashboardShellProps } from "@/types/elements";
import { FloatingParticles } from "@elements/floating-particles";
import { DotBackground } from "@elements/dot-background";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const DashboardShell = ({
  header,
  sidebar,
  children,
  className,
}: TDashboardShellProps) => {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-background text-foreground",
        className,
      )}
    >
      <DotBackground />
      <FloatingParticles />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[var(--header-grad)] opacity-80" />

      <section className="relative mx-auto px-4 pb-6 pt-28 md:px-6 md:pb-8 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          {header}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div>{sidebar}</div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="min-w-0 space-y-6"
          >
            {children}
          </motion.div>
        </div>
      </section>
    </main>
  );
};
