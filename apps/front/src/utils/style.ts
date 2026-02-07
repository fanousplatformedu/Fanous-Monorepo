// ============== Header ===============
export const headerStyles = {
  root:
    "fixed top-0 inset-x-0 z-50 transition-all duration-300 " + "border-none",
  rootScrolled: "shadow-md backdrop-blur-xl",
  headerGradLayer:
    "pointer-events-none absolute inset-0 bg-[var(--header-grad)] opacity-90",
  container: "relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8",
  row: "h-16 md:h-18 flex items-center justify-between",
  actions: "flex items-center gap-1.5 sm:gap-2",
  mobilePanelWrap:
    "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
  mobilePanelInner: "px-5 pb-6 pt-3 bg-card/80 backdrop-blur-lg",
  mobileLinksWrap: "flex flex-col gap-2",
  mobileLinkBase:
    "flex items-center px-4 py-3 rounded-xl text-sm font-medium " +
    "transition-all duration-300 ease-out",
  mobileLinkOpen: "opacity-100 translate-y-0",
  mobileLinkClosed: "opacity-0 translate-y-2",
};

export const navLinkStyles = {
  desktopBase:
    "relative px-4 py-2 text-sm font-medium rounded-xl " +
    "transition-colors duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  underline:
    "after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 " +
    "after:h-0.5 after:rounded-full after:bg-current after:opacity-0 " +
    "after:origin-center after:scale-x-0 after:transition-transform after:duration-300 after:ease-out " +
    "hover:after:opacity-60 hover:after:scale-x-100",
  active: "text-foreground after:opacity-70 after:scale-x-100",
  idle: "text-muted-foreground hover:text-foreground",
};

// ================ Footer ===============
export const footerStyles = {
  root: "relative mt-16",
  container: "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8",
  topSeparator: "h-px w-full bg-border/60",
  contentPad: "py-14",
  grid: "grid gap-10 lg:grid-cols-12",
  leftCol: "lg:col-span-4",
  rightCol: "lg:col-span-8",
  linkCols: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
  bottomBar:
    "mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  desc: "mt-4 text-sm text-muted-foreground leading-6 max-w-sm",
  contactWrap: "mt-5 flex flex-col gap-2",
  contactLink:
    "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
  contactMeta: "inline-flex items-center gap-2 text-sm text-muted-foreground",

  footerLink:
    "group inline-flex items-center gap-1.5 text-sm " +
    "text-muted-foreground hover:text-foreground transition-colors " +
    "relative " +
    "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:rounded-full " +
    "after:w-full after:scale-x-0 after:origin-left after:transition-transform after:duration-300 " +
    "after:bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] " +
    "dark:after:bg-[linear-gradient(135deg,rgba(214,170,110,1),rgba(241,230,214,1))] " +
    "group-hover:after:scale-x-100",
  linkIcon: "h-3.5 w-3.5 opacity-0 group-hover:opacity-70 transition-opacity",
  newsletterCard:
    "mt-10 rounded-3xl p-5 sm:p-6 " +
    "bg-card/60 backdrop-blur-xl " +
    "border border-border/60",
  newsletterRow:
    "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
  newsletterTitle: "font-semibold text-foreground",
  newsletterDesc: "text-sm text-muted-foreground mt-1",

  newsletterForm: "flex items-center gap-2",
  newsletterInput:
    "h-10 w-full sm:w-64 rounded-2xl px-4 text-sm " +
    "bg-background/70 border border-border/60 " +
    "outline-none focus:ring-2 focus:ring-ring/40",
  newsletterBtn: "h-10 rounded-2xl px-5 font-semibold",
};

// =============== Home page ===============
export const homeStyles = {
  page: "relative",

  container: "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8",
  sectionPad: "py-16 sm:py-20",

  heroRoot:
    "relative overflow-hidden text-white " +
    "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(96,165,250,1),rgba(59,130,246,1))]",

  heroOverlay:
    "pointer-events-none absolute inset-0 " +
    "bg-[radial-gradient(900px_380px_at_50%_0%,rgba(255,255,255,0.22),transparent_60%)] " +
    "opacity-100",

  heroGlow1:
    "pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl " +
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06))]",

  heroGlow2:
    "pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full blur-3xl " +
    "bg-[linear-gradient(135deg,rgba(16,185,129,0.20),rgba(255,255,255,0.06))]",

  heroContent: "relative py-20 lg:py-28",

  pill:
    "inline-flex items-center gap-3 px-5 py-2.5 rounded-full " +
    "bg-white/10 backdrop-blur-md border border-white/20",

  heroTitle:
    "text-balance font-semibold tracking-tight " +
    "text-4xl sm:text-5xl lg:text-6xl",

  heroDesc: "text-white/90 text-base sm:text-lg leading-7 max-w-2xl mx-auto",

  heroActions:
    "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3",

  heroStatsWrap: "mt-12 grid grid-cols-3 gap-6 sm:gap-10 max-w-2xl mx-auto",

  statCard:
    "rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md " +
    "px-3 py-4 sm:px-4 sm:py-5",
  badge:
    "inline-flex items-center gap-2 px-4 py-2 rounded-full " +
    "bg-primary/10 text-primary dark:bg-primary/15",

  h2: "text-balance font-semibold tracking-tight text-2xl sm:text-3xl lg:text-4xl text-foreground",
  p: "text-muted-foreground max-w-2xl mx-auto leading-7 text-sm sm:text-base",
  card:
    "group relative overflow-hidden rounded-3xl border border-border/60 " +
    "bg-background/60 backdrop-blur-xl shadow-sm transition-all " +
    "hover:shadow-md hover:-translate-y-0.5",

  cardGlow:
    "pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 " +
    "bg-[radial-gradient(550px_220px_at_30%_0%,rgba(59,130,246,0.25),transparent_65%)] " +
    "group-hover:opacity-100",

  iconBox:
    "h-12 w-12 rounded-2xl flex items-center justify-center " +
    "bg-primary/10 text-primary",

  roleChip:
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium " +
    "bg-muted/60 text-foreground border border-border/60",
  ctaRoot:
    "relative overflow-hidden rounded-[2.2rem] text-white " +
    "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(16,185,129,1))]",
  ctaInner: "relative p-8 sm:p-10",
  ctaGlow:
    "pointer-events-none absolute inset-0 " +
    "bg-[radial-gradient(900px_380px_at_50%_0%,rgba(255,255,255,0.22),transparent_65%)]",
};
