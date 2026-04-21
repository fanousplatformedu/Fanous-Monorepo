"use client";

import { TParentResourcesFilterValues, TResourceItem } from "@/types/modules";
import { ParentResourcesSummaryCards } from "@modules/Dashboard/Parent/parts/rescources-summary-cards";
import { ParentResourceDetailDialog } from "@modules/Dashboard/Parent/parts/resource-detail-dialog";
import { useParentResourcesQuery } from "@/lib/redux/api/endpoints/parent.api";
import { ParentResourcesFilters } from "@modules/Dashboard/Parent/parts/resources-filters";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { ParentResourcesTable } from "@modules/Dashboard/Parent/parts/resources-table";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import type * as TAPI from "@lib/graphql/generated";
import * as L from "lucide-react";

const defaultFilters: TParentResourcesFilterValues = {
  query: "",
  category: "ALL",
};

const ParentResourcesPage = () => {
  const { t } = useI18n();

  // =============== States ===================
  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TParentResourcesFilterValues>(defaultFilters);
  const [selectedResource, setSelectedResource] =
    useState<TResourceItem | null>(null);
  const skip = (page - 1) * PAGE_SIZE;

  // ================= API Hooks ===================
  const { data, isLoading, isFetching } = useParentResourcesQuery({
    take: PAGE_SIZE,
    skip,
    query: filters.query.trim() || undefined,
    category: filters.category === "ALL" ? undefined : filters.category,
  } as TAPI.ListParentResourcesInput);
  const items = useMemo<TResourceItem[]>(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;
  const wellbeingCount = useMemo(
    () => items.filter((item) => item.category === "WELLBEING").length,
    [items],
  );
  const careerCount = useMemo(
    () => items.filter((item) => item.category === "CAREER_GUIDE").length,
    [items],
  );
  const supportCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.category === "STUDY_SUPPORT" ||
          item.category === "SUPPORT_TEEN" ||
          item.category === "COMMUNICATION",
      ).length,
    [items],
  );

  // ================= Guards ===================
  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <ParentResourcesSummaryCards
          totalResources={total}
          careerCount={careerCount}
          supportCount={supportCount}
          wellbeingCount={wellbeingCount}
        />

        <DashboardSection
          title={t("dashboard.parent.resources.filtersCard.title")}
          description={t("dashboard.parent.resources.filtersCard.description")}
        >
          <ParentResourcesFilters
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
            icon={L.FileText}
            title={t("dashboard.parent.resources.empty.title")}
            description={t("dashboard.parent.resources.empty.description")}
          />
        ) : (
          <ParentResourcesTable
            page={page}
            total={total}
            items={items}
            onPageChange={setPage}
            isFetching={isFetching}
            onOpenDetail={setSelectedResource}
          />
        )}
      </div>

      <ParentResourceDetailDialog
        open={Boolean(selectedResource)}
        resource={selectedResource}
        onOpenChange={(open) => {
          if (!open) setSelectedResource(null);
        }}
      />
    </>
  );
};

export default ParentResourcesPage;
