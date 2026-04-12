"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { TTablePaginationProps } from "@/types/elements";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const TablePagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: TTablePaginationProps) => {
  const { t } = useI18n();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-border/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {t("tablePagination.summary", {
          page,
          totalPages,
          total,
        })}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          disabled={!canPrev}
          variant="brandChip"
          className="rounded-2xl"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("common.previous")}
        </Button>

        <Button
          type="button"
          disabled={!canNext}
          variant="brandChip"
          className="rounded-2xl"
          onClick={() => onPageChange(page + 1)}
        >
          {t("common.next")}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
