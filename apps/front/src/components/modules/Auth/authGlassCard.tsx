"use client";

import { TAuthGlassCardProps } from "@/types/modules";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import * as C from "@ui/card";

const AuthGlassCard = ({
  children,
  className,
  glowClassName,
}: TAuthGlassCardProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45 },
        },
      }}
      className="relative"
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-3 rounded-[2rem] blur-2xl opacity-50",
          "bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(147,197,253,0.10),transparent)]",
          "dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.16),rgba(200,170,130,0.10),transparent)]",
          glowClassName,
        )}
      />

      <C.Card
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 shadow-[0_20px_80px_rgba(0,0,0,0.10)] backdrop-blur-2xl",
          "before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_35%)] before:content-['']",
          "dark:before:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_35%)]",
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_35%)]" />
        <div className="relative">{children}</div>
      </C.Card>
    </motion.div>
  );
};

export default AuthGlassCard;
