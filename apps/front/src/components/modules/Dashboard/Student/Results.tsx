"use client";

import { useMyAssessmentResultDetailQuery } from "@/lib/redux/api/endpoints/student.api";
import { TResultFilterValues, TResultRow } from "@/types/modules";
import { useMyAssessmentResultsQuery } from "@/lib/redux/api/endpoints/student.api";
import { StudentResultCompareDialog } from "@modules/Dashboard/Student/parts/result-compare-dialog";
import { StudentResultDetailDialog } from "@modules/Dashboard/Student/parts/result-detail-dialog";
import { useCompareResultsQuery } from "@/lib/redux/api/endpoints/student.api";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { StudentResultFilters } from "@modules/Dashboard/Student/parts/result-filter";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { StudentResultTable } from "@modules/Dashboard/Student/parts/result-table";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

const defaultFilters: TResultFilterValues = {
  dominantIntelligence: "ALL",
};

const StudentResultsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<TResultFilterValues>(defaultFilters);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = useMyAssessmentResultsQuery({
    take: PAGE_SIZE,
    skip,
    dominantIntelligence:
      filters.dominantIntelligence === "ALL"
        ? undefined
        : filters.dominantIntelligence,
  });

  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useMyAssessmentResultDetailQuery(selectedResultId ?? "", {
    skip: !selectedResultId,
  });

  const baseResultId = compareIds[0];
  const compareWithResultId = compareIds[1];

  const {
    data: compareData,
    isFetching: isCompareFetching,
    isLoading: isCompareLoading,
  } = useCompareResultsQuery(
    {
      baseResultId: baseResultId!,
      compareWithResultId: compareWithResultId!,
    },
    {
      skip: !baseResultId || !compareWithResultId || !compareOpen,
    },
  );

  const items = useMemo<TResultRow[]>(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const averageScore = useMemo(() => {
    if (!items.length) return 0;
    const sum = items.reduce((acc, item) => {
      const avg =
        (Number(item.musical ?? 0) +
          Number(item.linguistic ?? 0) +
          Number(item.logicalMath ?? 0) +
          Number(item.naturalistic ?? 0) +
          Number(item.visualSpatial ?? 0) +
          Number(item.interpersonal ?? 0) +
          Number(item.intrapersonal ?? 0) +
          Number(item.bodilyKinesthetic ?? 0)) /
        8;
      return acc + avg;
    }, 0);
    return Math.round(sum / items.length);
  }, [items]);

  const dominantDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const key = item.dominantIntelligence || "UNKNOWN";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([key, count]) => ({
      label:
        key === "UNKNOWN"
          ? t("dashboard.student.results.common.notAvailable")
          : t(`dashboard.student.results.intelligences.${key}`),
      value: count,
    }));
  }, [items, t]);

  const handleOpenDetail = (resultId: string) => {
    setSelectedResultId(resultId);
  };

  const handleCloseDetail = (open: boolean) => {
    if (!open) setSelectedResultId(null);
  };

  const handleToggleCompare = (resultId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(resultId)) return prev.filter((id) => id !== resultId);
      if (prev.length >= 2) return [prev[1], resultId];
      return [...prev, resultId];
    });
  };

  const handleOpenCompare = (resultId?: string) => {
    if (resultId)
      setCompareIds((prev) => {
        if (prev.includes(resultId)) return prev;
        if (prev.length >= 2) return [prev[1], resultId];
        return [...prev, resultId];
      });
    if ((resultId && compareIds.length >= 1) || compareIds.length === 2)
      setCompareOpen(true);
  };

  const selectedCompareRows = useMemo(
    () => items.filter((item) => compareIds.includes(item.id)),
    [compareIds, items],
  );

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardSection
            title={t("dashboard.student.results.kpis.total.title")}
            description={t("dashboard.student.results.kpis.total.description")}
          >
            <p className="text-3xl font-bold text-foreground">{total}</p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.results.kpis.average.title")}
            description={t(
              "dashboard.student.results.kpis.average.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">
              {averageScore}%
            </p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.results.kpis.compare.title")}
            description={t(
              "dashboard.student.results.kpis.compare.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">
              {compareIds.length}/2
            </p>
          </DashboardSection>
        </div>

        <DashboardSection
          title={t("dashboard.student.results.filtersCard.title")}
          description={t("dashboard.student.results.filtersCard.description")}
        >
          <StudentResultFilters
            value={filters}
            onApply={(nextFilters) => {
              setPage(1);
              setFilters(nextFilters);
            }}
            onReset={() => {
              setPage(1);
              setFilters(defaultFilters);
            }}
          />
        </DashboardSection>

        {!items.length ? (
          <DashboardEmptyState
            icon={L.ChartColumnBig}
            title={t("dashboard.student.results.empty.title")}
            description={t("dashboard.student.results.empty.description")}
          />
        ) : (
          <StudentResultTable
            page={page}
            items={items}
            total={total}
            onPageChange={setPage}
            isFetching={isFetching}
            compareIds={compareIds}
            onViewDetail={handleOpenDetail}
            onOpenCompare={handleOpenCompare}
            onToggleCompare={handleToggleCompare}
          />
        )}
      </div>

      <StudentResultDetailDialog
        result={detail ?? null}
        open={Boolean(selectedResultId)}
        isLoading={isDetailLoading || isDetailFetching}
        onCompare={() => {
          if (selectedResultId) handleToggleCompare(selectedResultId);
          setCompareOpen(true);
        }}
        onOpenChange={handleCloseDetail}
      />

      <StudentResultCompareDialog
        open={compareOpen}
        compareIds={compareIds}
        data={compareData ?? []}
        onOpenChange={setCompareOpen}
        compareRows={selectedCompareRows}
        isLoading={isCompareLoading || isCompareFetching}
        onClearSelection={() => {
          setCompareIds([]);
          setCompareOpen(false);
        }}
      />
    </>
  );
};

export default StudentResultsPage;
