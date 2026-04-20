import { TChartRow, TSummaryPoint } from "@/types/modules";
import { TNavItem, TSocialItem } from "@/types/constant";

import * as L from "lucide-react";

// =========== Default Api ===========
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_DEFAULT = 12;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim();
export const GRAPHQL_ENDPOINT = endpoint || "/graphql";

// =========== Nav =============
export const NAV_ITEMS: TNavItem[] = [
  { id: "home", href: "/", labelKey: "nav.home" },
  { id: "about", href: "/about", labelKey: "nav.about" },
  { id: "contact", href: "/contact", labelKey: "nav.contact" },
];

export const SOCIALS: TSocialItem[] = [
  { icon: L.Twitter, label: "X", href: "https://x.com" },
  { icon: L.Github, label: "GitHub", href: "https://github.com" },
  { icon: L.Youtube, label: "YouTube", href: "https://youtube.com" },
  { icon: L.Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

// ================ Home page ================
export const HOME_FEATURES = [
  {
    icon: L.BarChart3,
    titleKey: "home.features.items.assess.title",
    descKey: "home.features.items.assess.desc",
  },
  {
    icon: L.Compass,
    titleKey: "home.features.items.ai.title",
    descKey: "home.features.items.ai.desc",
  },
  {
    icon: L.Users,
    titleKey: "home.features.items.multi.title",
    descKey: "home.features.items.multi.desc",
  },
  {
    icon: L.BookOpen,
    titleKey: "home.features.items.reports.title",
    descKey: "home.features.items.reports.desc",
  },
] as const;

export const HOME_TRUST = [
  {
    icon: L.Shield,
    titleKey: "home.trust.security.title",
    descKey: "home.trust.security.desc",
  },
  {
    icon: L.Globe,
    titleKey: "home.trust.bilingual.title",
    descKey: "home.trust.bilingual.desc",
  },
  {
    icon: L.CheckCircle,
    titleKey: "home.trust.wcag.title",
    descKey: "home.trust.wcag.desc",
  },
] as const;

export const HOME_ROLES = [
  {
    colorClass: "bg-primary",
    titleKey: "home.roles.items.students.title",
    descKey: "home.roles.items.students.desc",
    bulletsKey: "home.roles.items.students.bullets",
  },
  {
    colorClass: "bg-emerald-500",
    titleKey: "home.roles.items.counselors.title",
    descKey: "home.roles.items.counselors.desc",
    bulletsKey: "home.roles.items.counselors.bullets",
  },
  {
    colorClass: "bg-amber-500",
    titleKey: "home.roles.items.admins.title",
    descKey: "home.roles.items.admins.desc",
    bulletsKey: "home.roles.items.admins.bullets",
  },
  {
    colorClass: "bg-indigo-500",
    titleKey: "home.roles.items.parents.title",
    descKey: "home.roles.items.parents.desc",
    bulletsKey: "home.roles.items.parents.bullets",
  },
  {
    colorClass: "bg-violet-500",
    titleKey: "home.roles.items.super.title",
    descKey: "home.roles.items.super.desc",
    bulletsKey: "home.roles.items.super.bullets",
  },
] as const;

// ============= Auth =============
export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 30;

// ============= Dashboard ==============
export const PAGE_SIZE = 10;

export const RETURN_TO_KEY = "force_password_return_to";

export const ALL_GRADES_VALUE = "__ALL_GRADES__";

// ============== Dialog ================
export const sizeClassMap = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

// ============ Student Result Detail =============
type TTranslate = (
  key: string,
  params?: Record<string, string>,
  fallback?: string,
) => string;

export const getShortIntelligenceLabel = (key: string, t: TTranslate) => {
  const map: Record<string, string> = {
    LINGUISTIC: t(
      "dashboard.student.results.detail.shortLabels.LINGUISTIC",
      {},
      "Ling",
    ),
    LOGICAL_MATHEMATICAL: t(
      "dashboard.student.results.detail.shortLabels.LOGICAL_MATHEMATICAL",
      {},
      "Logic",
    ),
    MUSICAL: t(
      "dashboard.student.results.detail.shortLabels.MUSICAL",
      {},
      "Music",
    ),
    BODILY_KINESTHETIC: t(
      "dashboard.student.results.detail.shortLabels.BODILY_KINESTHETIC",
      {},
      "Body",
    ),
    VISUAL_SPATIAL: t(
      "dashboard.student.results.detail.shortLabels.VISUAL_SPATIAL",
      {},
      "Visual",
    ),
    NATURALISTIC: t(
      "dashboard.student.results.detail.shortLabels.NATURALISTIC",
      {},
      "Nature",
    ),
    INTERPERSONAL: t(
      "dashboard.student.results.detail.shortLabels.INTERPERSONAL",
      {},
      "Social",
    ),
    INTRAPERSONAL: t(
      "dashboard.student.results.detail.shortLabels.INTRAPERSONAL",
      {},
      "Self",
    ),
  };
  return map[key] ?? key;
};

export const getDominantInsightText = (
  dominantIntelligence: string | null | undefined,
  t: TTranslate,
) => {
  if (!dominantIntelligence)
    return t("dashboard.student.results.common.notAvailable");
  return t(`dashboard.student.results.intelligences.${dominantIntelligence}`);
};

export const buildChartData = (result: any, t: TTranslate): TChartRow[] => {
  if (!result) return [];
  const rows: Array<{ key: string; value: number }> = [
    { key: "LINGUISTIC", value: Number(result.linguistic ?? 0) },
    { key: "LOGICAL_MATHEMATICAL", value: Number(result.logicalMath ?? 0) },
    { key: "MUSICAL", value: Number(result.musical ?? 0) },
    {
      key: "BODILY_KINESTHETIC",
      value: Number(result.bodilyKinesthetic ?? 0),
    },
    { key: "VISUAL_SPATIAL", value: Number(result.visualSpatial ?? 0) },
    { key: "NATURALISTIC", value: Number(result.naturalistic ?? 0) },
    { key: "INTERPERSONAL", value: Number(result.interpersonal ?? 0) },
    { key: "INTRAPERSONAL", value: Number(result.intrapersonal ?? 0) },
  ];
  return rows.map((item) => ({
    key: item.key,
    value: item.value,
    shortLabel: getShortIntelligenceLabel(item.key, t),
    fullLabel: t(`dashboard.student.results.intelligences.${item.key}`),
  }));
};

export const getTopScores = (chartData: TChartRow[]) => {
  return [...chartData].sort((a, b) => b.value - a.value).slice(0, 3);
};

export const getAverageScore = (chartData: TChartRow[]) => {
  if (!chartData.length) return 0;
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  return Math.round(total / chartData.length);
};

export const getNarrativeSummary = (scoreSummary: unknown, t: TTranslate) => {
  if (!scoreSummary)
    return t(
      "dashboard.student.results.detail.noSummary",
      {},
      "No summary is available for this result yet.",
    );
  if (typeof scoreSummary === "string") return scoreSummary;
  try {
    return JSON.stringify(scoreSummary, null, 2);
  } catch {
    return String(scoreSummary);
  }
};

export const buildSummaryPoints = ({
  result,
  averageScore,
  topStrength,
  t,
}: {
  result: any;
  averageScore: number;
  topStrength?: string;
  t: TTranslate;
}): TSummaryPoint[] => {
  if (!result) return [];
  return [
    {
      icon: L.FileText,
      label: t("dashboard.student.results.detail.assignment"),
      value:
        result.assignmentTitle ||
        t("dashboard.student.results.common.notAvailable"),
    },
    {
      icon: L.Sparkles,
      label: t("dashboard.student.results.detail.dominant"),
      value: getDominantInsightText(result.dominantIntelligence, t),
    },
    {
      icon: L.Percent,
      label: t(
        "dashboard.student.results.detail.averageScore",
        {},
        "Average score",
      ),
      value: `${averageScore}%`,
    },
    {
      icon: L.Award,
      label: t(
        "dashboard.student.results.detail.topStrength",
        {},
        "Top strength",
      ),
      value: topStrength || t("dashboard.student.results.common.notAvailable"),
    },
  ];
};
