"use client";

import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { TTableSortButtonProps } from "@/types/elements";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

export const TableSortButton = ({
  label,
  active,
  onClick,
  direction = "asc",
}: TTableSortButtonProps) => {
  return (
    <Button
      type="button"
      variant={"brandSoft"}
      onClick={onClick}
      className={cn(
        "h-auto px-0 py-0 rounded-2xl font-medium text-foreground hover:bg-transparent",
        active && "text-primary",
      )}
    >
      <span>{label}</span>
      {direction === "asc" ? (
        <ArrowUpAZ className="ml-1.5 h-4 w-4" />
      ) : (
        <ArrowDownAZ className="ml-1.5 h-4 w-4" />
      )}
    </Button>
  );
};
