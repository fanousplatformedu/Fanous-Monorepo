"use client";

import { cn } from "@/lib/utils";

export const DotBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Vignette / depth */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(1200px_500px_at_50%_0%,rgba(59,130,246,0.16),transparent_60%)]",
          "dark:bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(214,170,110,0.14),transparent_60%)]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(900px_600px_at_50%_100%,rgba(2,6,23,0.08),transparent_60%)]",
          "dark:bg-[radial-gradient(900px_600px_at_50%_100%,rgba(0,0,0,0.30),transparent_62%)]",
        )}
      />

      {/* Grid #1 */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.42] dark:opacity-[0.30]",
          "bg-[radial-gradient(circle_at_1px_1px,rgba(2,6,23,0.16)_1px,transparent_0)]",
          "dark:bg-[radial-gradient(circle_at_1px_1px,rgba(241,230,214,0.14)_1px,transparent_0)]",
          "bg-[size:18px_18px]",
          "[mask-image:radial-gradient(700px_420px_at_18%_15%,black,transparent)]",
        )}
      />

      {/* Grid #2 */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.38] dark:opacity-[0.28]",
          "bg-[radial-gradient(circle_at_1px_1px,rgba(2,6,23,0.14)_1px,transparent_0)]",
          "dark:bg-[radial-gradient(circle_at_1px_1px,rgba(241,230,214,0.12)_1px,transparent_0)]",
          "bg-[size:18px_18px]",
          "[mask-image:radial-gradient(720px_460px_at_82%_78%,black,transparent)]",
        )}
      />

      {/* Sparkle */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.18] dark:opacity-[0.14]",
          "bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.22)_1px,transparent_0)]",
          "dark:bg-[radial-gradient(circle_at_1px_1px,rgba(214,170,110,0.18)_1px,transparent_0)]",
          "bg-[size:26px_26px]",
          "[mask-image:radial-gradient(900px_520px_at_50%_50%,black,transparent)]",
        )}
      />

      {/* Glow blobs */}
      <div
        className={cn(
          "absolute -top-20 left-6 h-64 w-64 rounded-full blur-3xl",
          "bg-[linear-gradient(135deg,rgba(59,130,246,0.32),rgba(147,197,253,0.22))]",
          "dark:bg-[linear-gradient(135deg,rgba(241,230,214,0.20),rgba(214,170,110,0.14))]",
          "animate-[pulse_5s_ease-in-out_infinite]",
        )}
      />
      <div
        className={cn(
          "absolute -bottom-28 right-6 h-72 w-72 rounded-full blur-3xl",
          "bg-[linear-gradient(135deg,rgba(59,130,246,0.26),rgba(147,197,253,0.18))]",
          "dark:bg-[linear-gradient(135deg,rgba(241,230,214,0.18),rgba(214,170,110,0.12))]",
          "animate-[pulse_6s_ease-in-out_infinite]",
        )}
      />
      <div
        className={cn(
          "absolute top-1/2 -left-16 h-64 w-64 -translate-y-1/2 rounded-full blur-3xl",
          "bg-[linear-gradient(135deg,rgba(147,197,253,0.20),rgba(59,130,246,0.14))]",
          "dark:bg-[linear-gradient(135deg,rgba(214,170,110,0.12),rgba(241,230,214,0.10))]",
          "animate-[pulse_7s_ease-in-out_infinite]",
        )}
      />
    </div>
  );
};
