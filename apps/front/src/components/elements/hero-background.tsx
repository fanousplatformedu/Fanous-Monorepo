"use client";

import { cn } from "@/lib/utils";

export const HeroDotBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Top glow */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(56,189,248,0.25),transparent_60%)]",
          "dark:bg-[radial-gradient(1000px_520px_at_50%_-10%,rgba(56,189,248,0.18),transparent_60%)]",
        )}
      />

      {/* Soft center fade */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(800px_600px_at_50%_40%,rgba(2,6,23,0.06),transparent_70%)]",
          "dark:bg-[radial-gradient(800px_600px_at_50%_40%,rgba(0,0,0,0.35),transparent_70%)]",
        )}
      />

      {/* Dot grid */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.35] dark:opacity-[0.25]",
          "bg-[radial-gradient(circle_at_1px_1px,rgba(2,6,23,0.18)_1.2px,transparent_0)]",
          "dark:bg-[radial-gradient(circle_at_1px_1px,rgba(186,230,253,0.18)_1.2px,transparent_0)]",
          "bg-[size:22px_22px]",
          "[mask-image:radial-gradient(700px_500px_at_50%_20%,black,transparent)]",
        )}
      />

      {/* Secondary grid */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.25] dark:opacity-[0.20]",
          "bg-[radial-gradient(circle_at_1px_1px,rgba(56,189,248,0.25)_1px,transparent_0)]",
          "bg-[size:30px_30px]",
          "[mask-image:radial-gradient(900px_600px_at_50%_40%,black,transparent)]",
        )}
      />

      {/* Glow blobs */}
      <div
        className={cn(
          "absolute -top-24 left-1/3 h-72 w-72 rounded-full blur-3xl",
          "bg-[linear-gradient(135deg,rgba(56,189,248,0.35),rgba(125,211,252,0.20))]",
          "animate-[pulse_6s_ease-in-out_infinite]",
        )}
      />

      <div
        className={cn(
          "absolute top-1/2 -right-24 h-80 w-80 -translate-y-1/2 rounded-full blur-3xl",
          "bg-[linear-gradient(135deg,rgba(14,165,233,0.30),rgba(56,189,248,0.18))]",
          "animate-[pulse_7s_ease-in-out_infinite]",
        )}
      />
    </div>
  );
};
