import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        soft:
          "bg-muted/60 text-foreground hover:bg-muted " +
          "shadow-none border border-border/60 " +
          "backdrop-blur-sm transition-colors",

        // Login, Submit, Save, Create
        brand:
          "rounded-xl text-primary-foreground " +
          "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] " +
          "transition-all duration-500 ease-in-out " +
          "shadow-sm hover:shadow-md " +
          "hover:bg-[linear-gradient(135deg,rgba(147,197,253,1),rgba(59,130,246,1))] " +
          "hover:brightness-[1.02] active:brightness-[0.98] " +
          "focus-visible:ring-2 focus-visible:ring-ring/50",

        // Back, View Details, Secondary action, Filter,
        brandSoft:
          "rounded-xl border border-blue-200/70 bg-[linear-gradient(135deg,rgba(59,130,246,0.10),rgba(147,197,253,0.18))] " +
          "text-blue-700 shadow-none backdrop-blur-sm transition-all duration-300 " +
          "hover:bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(147,197,253,0.24))] hover:shadow-sm " +
          "active:scale-[0.99] " +
          "dark:border-[rgba(243,226,199,0.18)] dark:bg-[linear-gradient(135deg,rgba(243,226,199,0.10),rgba(200,170,130,0.14))] " +
          "dark:text-[var(--primary)] dark:hover:bg-[linear-gradient(135deg,rgba(243,226,199,0.16),rgba(200,170,130,0.20))] " +
          "focus-visible:ring-2 focus-visible:ring-ring/40",

        // Cancel, Close, Open Modal, Low-priority
        brandOutline:
          "rounded-xl border border-blue-300/70 bg-white/40 text-blue-700 backdrop-blur-xl " +
          "transition-all duration-300 shadow-none " +
          "hover:bg-blue-50/80 hover:border-blue-400/80 hover:text-blue-800 hover:shadow-sm " +
          "active:scale-[0.99] " +
          "dark:border-[rgba(243,226,199,0.22)] dark:bg-white/5 dark:text-[var(--primary)] " +
          "dark:hover:bg-white/10 dark:hover:border-[rgba(243,226,199,0.34)] " +
          "focus-visible:ring-2 focus-visible:ring-ring/40",

        brandChip:
          "rounded-2xl border border-border/60 bg-card/55 text-foreground " +
          "backdrop-blur-xl shadow-none transition-all duration-200 " +
          "hover:bg-card/80 hover:border-border " +
          "focus-visible:ring-2 focus-visible:ring-ring/40 " +
          "dark:border-[rgba(243,226,199,0.14)] dark:bg-white/6 dark:text-[var(--foreground)] " +
          "dark:hover:bg-white/10 dark:hover:border-[rgba(243,226,199,0.24)] " +
          "data-[state=active]:border-transparent " +
          "data-[state=active]:bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] " +
          "data-[state=active]:text-white " +
          "data-[state=active]:shadow-[0_10px_24px_rgba(59,130,246,0.18)] " +
          "dark:data-[state=active]:bg-[linear-gradient(135deg,rgba(243,226,199,1),rgba(200,170,130,0.92))] " +
          "dark:data-[state=active]:text-[#2a2018]",

        brandDanger:
          "rounded-2xl border border-rose-300/60 bg-rose-500/8 text-rose-700 " +
          "backdrop-blur-xl shadow-none transition-all duration-200 " +
          "hover:bg-rose-500/14 hover:border-rose-400/70 " +
          "dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300 " +
          "dark:hover:bg-rose-500/16 " +
          "focus-visible:ring-2 focus-visible:ring-rose-500/20",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
