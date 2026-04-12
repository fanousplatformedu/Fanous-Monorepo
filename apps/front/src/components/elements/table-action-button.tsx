"use client";

import { TTableActionButtonProps } from "@/types/elements";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

export const TableActionButton = ({
  label,
  onClick,
  disabled,
  className,
  icon: Icon,
  loading = false,
  variant = "brandChip",
}: TTableActionButtonProps) => {
  return (
    <Button
      type="button"
      variant={variant}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "h-9 rounded-2xl px-3 text-xs font-medium sm:text-sm",
        variant === "brandChip" &&
          "data-[state=inactive]:bg-card/55 data-[state=inactive]:text-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
};
