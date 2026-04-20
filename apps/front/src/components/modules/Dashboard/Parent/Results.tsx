"use client";

import { ParentResultsDistributionChart } from "@modules/Dashboard/Parent/parts/results-distribution-chart";
import { useCompareParentResultsQuery } from "@/lib/redux/api/endpoints/parent.api";
import { useParentChildResultsQuery } from "@/lib/redux/api/endpoints/parent.api";
import { useParentResultDetailQuery } from "@/lib/redux/api/endpoints/parent.api";
import { TParentResultsFilterValues } from "@/types/modules";
import { TDashboardParentResultItem } from "@/types/modules";
import { ParentResultsSummaryCards } from "@modules/Dashboard/Parent/parts/results-summary-cards";
import { ParentResultCompareDialog } from "@modules/Dashboard/Parent/parts/result-compare-dialog";
import { ParentResultDetailDialog } from "@modules/Dashboard/Parent/parts/result-detail-dialog";
import { ParentResultsFilters } from "@modules/Dashboard/Parent/parts/results-filters";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useMyChildrenQuery } from "@/lib/redux/api/endpoints/parent.api";
import { ParentResultsTable } from "@modules/Dashboard/Parent/parts/results-table";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import type * as TAPI from "@lib/graphql/generated";
import * as L from "lucide-react";

const defaultFilters: TParentResultsFilterValues = {
  childId: "ALL",
};

const ParentResultsPage = () => {
  const { t } = useI18n();

  // =============== States ====================
  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TParentResultsFilterValues>(defaultFilters);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const skip = (page - 1) * PAGE_SIZE;

  // =============== Hooks ====================
  const { data: childrenData, isLoading: isChildrenLoading } =
    useMyChildrenQuery({
      take: 100,
      skip: 0,
    });
  const {
    data: resultsData,
    isLoading: isResultsLoading,
    isFetching: isResultsFetching,
  } = useParentChildResultsQuery({
    take: PAGE_SIZE,
    skip,
    childId: filters.childId === "ALL" ? undefined : filters.childId,
  } as TAPI.ListParentChildResultsInput);
  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useParentResultDetailQuery(selectedResultId ?? "", {
    skip: !selectedResultId,
  });
  const baseResultId = compareIds[0];
  const compareWithResultId = compareIds[1];
  const {
    data: compareData,
    isLoading: isCompareLoading,
    isFetching: isCompareFetching,
  } = useCompareParentResultsQuery(
    {
      baseResultId: baseResultId!,
      compareWithResultId: compareWithResultId!,
    } as TAPI.CompareParentResultsInput,
    {
      skip: !baseResultId || !compareWithResultId || !compareOpen,
    },
  );

  // ================ Use Memo =================
  const items = useMemo<TDashboardParentResultItem[]>(
    () => resultsData?.items ?? [],
    [resultsData],
  );
  const total = resultsData?.total ?? 0;
  const childOptions = useMemo(() => {
    const items = childrenData?.items ?? [];
    return items.map((child) => ({
      value: child.id,
      label: child.fullName || child.email || child.mobile || child.id,
    }));
  }, [childrenData]);
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
      key,
      label:
        key === "UNKNOWN"
          ? t("dashboard.parent.results.common.notAvailable")
          : t(`dashboard.parent.results.intelligences.${key}`),
      value: count,
    }));
  }, [items, t]);

  // ================ Toggle Compare ================
  const handleToggleCompare = (resultId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(resultId)) return prev.filter((id) => id !== resultId);
      if (prev.length >= 2) return [prev[1], resultId];
      return [...prev, resultId];
    });
  };

  // ================ Open Compare ================
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

  // ================ Gurads ===============
  if (isChildrenLoading || isResultsLoading)
    return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <ParentResultsSummaryCards
              total={total}
              averageScore={averageScore}
              compareCount={compareIds.length}
            />
          </div>

          <div className="xl:w-auto">
            <Button
              type="button"
              variant="brand"
              className="w-full rounded-2xl xl:w-auto"
              disabled={compareIds.length !== 2}
              onClick={() => setCompareOpen(true)}
            >
              <L.Scale className="mr-2 h-4 w-4" />
              {t("dashboard.parent.results.actions.compare")}
            </Button>
          </div>
        </div>

        <DashboardSection
          title={t("dashboard.parent.results.filtersCard.title")}
          description={t("dashboard.parent.results.filtersCard.description")}
        >
          <ParentResultsFilters
            value={filters}
            childOptions={childOptions}
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

        <DashboardSection
          title={t("dashboard.parent.results.chartCard.title")}
          description={t("dashboard.parent.results.chartCard.description")}
        >
          <ParentResultsDistributionChart data={dominantDistribution} />
        </DashboardSection>

        {!items.length ? (
          <DashboardEmptyState
            icon={L.ChartColumnBig}
            title={t("dashboard.parent.results.empty.title")}
            description={t("dashboard.parent.results.empty.description")}
          />
        ) : (
          <ParentResultsTable
            page={page}
            total={total}
            items={items}
            onPageChange={setPage}
            compareIds={compareIds}
            isFetching={isResultsFetching}
            onOpenCompare={handleOpenCompare}
            onViewDetail={setSelectedResultId}
            onToggleCompare={handleToggleCompare}
          />
        )}
      </div>

      <ParentResultDetailDialog
        result={detail ?? null}
        open={Boolean(selectedResultId)}
        isLoading={isDetailLoading || isDetailFetching}
        onCompare={() => {
          if (selectedResultId) handleToggleCompare(selectedResultId);
          setCompareOpen(true);
        }}
        onOpenChange={(open) => {
          if (!open) setSelectedResultId(null);
        }}
      />

      <ParentResultCompareDialog
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

export default ParentResultsPage;
