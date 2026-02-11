"use client";

const AnimatedBackground = () => {
  return (
    <div
      className="
        absolute inset-0 -z-10 overflow-hidden
        rounded-xl text-primary-foreground
        bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))]
        transition-all duration-700 ease-in-out
        hover:bg-[linear-gradient(135deg,rgba(147,197,253,1),rgba(59,130,246,1))]
        hover:brightness-[1.02] active:brightness-[0.98]
        focus-visible:ring-2 focus-visible:ring-ring/50
        dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800
      "
    >
      {/* Blur Overlay  */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Large Sphere */}
      <div className="sphere w-[320px] h-[320px] top-[15%] left-[20%] animate-float-slow" />

      {/* Medium Sphere */}
      <div className="sphere w-[220px] h-[220px] bottom-[20%] right-[25%] animate-float-medium" />

      {/* Small Sphere */}
      <div className="sphere w-[160px] h-[160px] bottom-[35%] left-[35%] animate-float-fast" />

      {/* Extra Accent Sphere */}
      <div className="sphere w-[140px] h-[140px] top-[10%] right-[15%] animate-float-medium" />

      {/* Subtle Noise Layer (Premium Feel) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
    </div>
  );
};

export default AnimatedBackground;
