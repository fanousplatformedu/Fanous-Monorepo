// ============= Header =============
export type TBrandProps = {
  href?: string;
  size?: "sm" | "md";
};

export type TNavLinksProps = {
  href: string;
  label: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};
