"use client";

import { TGradeFiltersProps } from "@/types/modules";
import { Checkbox } from "@ui/checkbox";
import { useI18n } from "@/hooks/useI18n";

export const GradeFilters = ({
  includeArchived,
  onIncludeArchivedChange,
}: TGradeFiltersProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/50 bg-secondary/10 p-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id="include-archived-grades"
          checked={includeArchived}
          onCheckedChange={(checked) =>
            onIncludeArchivedChange(Boolean(checked))
          }
        />
        <label
          htmlFor="include-archived-grades"
          className="cursor-pointer text-sm text-foreground"
        >
          {t("dashboard.schoolAdmin.grades.filters.includeArchived")}
        </label>
      </div>
    </div>
  );
};
