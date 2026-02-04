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
