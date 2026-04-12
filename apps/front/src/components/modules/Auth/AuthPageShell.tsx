"use client";

import { TAuthPageShellProps } from "@/types/modules";
import { FloatingParticles } from "@elements/floating-particles";
import { DotBackground } from "@elements/dot-background";
import { motion } from "framer-motion";
import { MOTION } from "@/utils/motion";
import { cn } from "@/lib/utils";

const AuthPageShell = ({
  children,
  className,
  contentClassName,
}: TAuthPageShellProps) => {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-background text-foreground",
        className,
      )}
    >
      <DotBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--header-grad)] opacity-90" />
        <div className="sphere left-[-6rem] top-[12%] h-72 w-72 animate-float-slow opacity-80" />
        <div className="sphere right-[-7rem] top-[18%] h-96 w-96 animate-float-medium opacity-60" />
        <div className="sphere bottom-[8%] left-[28%] h-56 w-56 animate-float-fast opacity-70" />
        <div className="sphere right-[18%] bottom-[10%] h-44 w-44 animate-float-slow opacity-65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_38%)]" />
      </div>
      <FloatingParticles />
      <section className="container relative mx-auto flex min-h-screen items-center justify-center px-4 py-14 md:px-6">
        <motion.div
          variants={MOTION.fadeUpStagger({ y: 16, stagger: 0.08 })}
          initial="hidden"
          animate="show"
          className={cn("w-full max-w-md", contentClassName)}
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
};

export default AuthPageShell;
