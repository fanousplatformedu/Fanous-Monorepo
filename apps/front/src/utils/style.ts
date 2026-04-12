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
  root: "relative",
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

// =============== Role Way ================
export const roleGatewayStyles = {
  mainContainer:
    "relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90",
  contentSection: "relative z-10 mx-auto max-w-7xl px-4 py-20 md:py-28",
  contentContainer: "mx-auto max-w-4xl text-center",
  badgeContainer:
    "mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-2 backdrop-blur-sm",
  badgeIcon: "h-4 w-4 text-primary",
  badgeText: "text-sm font-medium text-primary",
  title:
    "mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl",
  description:
    "mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl",
  cardsGrid: "grid gap-8 md:grid-cols-3",
  footerContainer: "mt-16 text-center",
  footerText: "text-sm text-muted-foreground/70",
  background: {
    spheres: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
    sphereBase: "sphere absolute opacity-20",
    gradientOrb: "absolute rounded-full blur-3xl",
    gridPattern:
      "pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]",
  },
  card: {
    container: "perspective group relative",
    glow: "absolute -inset-0.5 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70",
    shadow:
      "absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/10 dark:to-black/20",
    base: "relative h-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl transition-all duration-500 group-hover:border-border/80",
    pattern:
      "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
    radial:
      "absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)]",
    header: "relative z-10 pb-6",
    iconContainer:
      "mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm",
    iconWrapper:
      "relative flex h-12 w-12 items-center justify-center rounded-xl",
    icon: "h-7 w-7",
    title: "mb-3 text-2xl font-bold",
    description: "text-base leading-relaxed",
    buttonContainer: "relative z-10 pt-0",
    button:
      "group/btn relative w-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-primary/10 to-primary/5 py-6 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:from-primary/20 hover:to-primary/10 hover:shadow-lg",
    buttonLink: "flex items-center justify-center gap-2",
    buttonIcon:
      "h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1",
    secondaryContainer: "mt-4 text-center",
    secondaryLink:
      "group/link inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-all hover:text-primary",
    secondaryText:
      "bg-gradient-to-r from-transparent via-primary/20 to-transparent bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-all duration-300 group-hover/link:bg-[length:100%_1px]",
    secondaryIcon:
      "h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1",
    line: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
  },
};

export const backgroundItems = {
  spheres: [
    "-left-20 top-1/4 h-64 w-64 animate-float-slow",
    "-right-32 top-1/3 h-80 w-80 opacity-15 animate-float-medium",
    "left-1/3 bottom-1/4 h-48 w-48 opacity-25 animate-float-fast",
    "right-1/4 top-1/2 h-56 w-56 animate-float-slow",
  ],
  orbs: [
    "left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/5 via-transparent to-violet-500/5",
    "right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5",
  ],
};

export const floatingAnimations = {
  slow: "animate-float-slow",
  medium: "animate-float-medium",
  fast: "animate-float-fast",
};

export const cardColors = {
  superAdmin: {
    gradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    cardGradient:
      "bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent",
  },
  schoolAdmin: {
    gradient: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-500",
    cardGradient:
      "bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent",
  },
  schoolUser: {
    gradient: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-500",
    cardGradient:
      "bg-gradient-to-br from-violet-500/10 via-violet-400/5 to-transparent",
  },
};

// ============= School Admin Login =================
export const schoolAdminLoginStyles = {
  mainContainer: "min-h-screen relative overflow-hidden bg-background",
  backgroundSpheres: "absolute inset-0 overflow-hidden",
  sphereBase: "absolute rounded-full",
  sphere1:
    "-left-40 top-1/4 h-96 w-96 bg-gradient-to-br from-emerald-500/8 via-emerald-400/4 to-transparent",
  sphere2:
    "-right-32 bottom-1/3 h-80 w-80 bg-gradient-to-tl from-green-500/8 via-green-400/4 to-transparent",
  sphere3:
    "left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-400/4 via-teal-500/8 to-transparent",
  gridPattern:
    "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]",
  contentContainer:
    "container relative mx-auto flex min-h-screen items-center justify-center px-4 py-16",
  formWrapper: "w-full max-w-md",
  badgeContainer: "mb-8 flex items-center justify-center gap-2",
  badgeIconWrapper: "rounded-full bg-emerald-500/8 p-2 backdrop-blur-sm",
  badgeIcon: "h-6 w-6 text-emerald-500",
  badgeText: "text-sm font-medium text-muted-foreground",
  cardContainer:
    "relative overflow-hidden rounded-2xl border-border/20 bg-card/95 backdrop-blur-xl shadow-lg",
  cardGlow:
    "absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent opacity-20 blur-xl",
  cardHeader: "text-center space-y-3 pb-6 px-8 pt-8",
  cardTitle:
    "text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400/80 bg-clip-text text-transparent",
  cardDescription: "text-sm text-muted-foreground/80 leading-relaxed",
  cardContent: "pb-8 px-8",
  formContainer: "space-y-5",
  formItem: "relative",
  formItemContainer: "relative",
  floatingLabel: (isFocused: boolean, hasValue: boolean) =>
    `absolute left-3 z-10 transition-all duration-300 ${
      isFocused || hasValue
        ? "-top-2.5 text-xs bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-border/30 text-emerald-500 shadow-sm"
        : "top-3 text-sm text-muted-foreground"
    }`,
  inputContainer: "relative",
  inputBase:
    "h-12 rounded-lg border-border/30 bg-input-background/50 pl-3 pt-4 text-sm transition-all duration-300",
  inputFocus:
    "focus:border-emerald-500/40 focus:bg-card/80 focus:shadow-sm focus:shadow-emerald-500/5 focus:outline-none",
  inputPassword: "pr-10",
  passwordToggle:
    "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-500 transition-colors duration-300 p-1.5 rounded-md hover:bg-emerald-500/5",
  formMessage: "mt-1.5 text-xs",
  actionButtons: "flex gap-3",
  backButton:
    "h-11 rounded-lg border-border/40 bg-secondary/10 text-muted-foreground hover:bg-secondary/20 hover:text-secondary-foreground hover:border-border/60 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium",
  backButtonIcon: "h-4 w-4",
  submitButton:
    "h-11 rounded-lg text-primary-foreground " +
    "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] " +
    "transition-all duration-500 ease-in-out " +
    "shadow-sm hover:shadow-md " +
    "hover:bg-[linear-gradient(135deg,rgba(147,197,253,1),rgba(59,130,246,1))] " +
    "hover:brightness-[1.02] active:brightness-[0.98] " +
    "focus-visible:ring-2 focus-visible:ring-ring/50 " +
    "flex items-center justify-center gap-2 text-sm font-semibold",
  submitButtonLoading: "opacity-80 cursor-not-allowed",
  submitButtonIcon:
    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5",
  footerLinkContainer: "pt-4 text-center",
  footerLink:
    "inline-flex items-center text-xs text-muted-foreground hover:text-emerald-500 transition-colors duration-300",
  footerLinkIcon: "mr-1.5 h-3.5 w-3.5",
  decorativeBorder:
    "absolute bottom-0 left-1/2 h-0.5 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent",
  footerContainer: "mt-6 text-center",
  footerText: "text-xs text-muted-foreground/60",
} as const;

// ============= Super Admin Login =================
export const superAdminLoginStyles = {
  mainContainer: "min-h-screen relative overflow-hidden bg-background",
  backgroundSpheres: "absolute inset-0 overflow-hidden",
  sphereBase: "absolute rounded-full",
  sphere1:
    "-left-40 top-1/4 h-96 w-96 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent",
  sphere2:
    "-right-32 bottom-1/3 h-80 w-80 bg-gradient-to-tl from-secondary/8 via-secondary/4 to-transparent",
  sphere3:
    "left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-accent/4 via-accent/8 to-transparent",
  gridPattern:
    "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]",
  contentContainer:
    "container relative mx-auto flex min-h-screen items-center justify-center px-4 py-16",
  formWrapper: "w-full max-w-md",
  badgeContainer: "mb-8 flex items-center justify-center gap-2",
  badgeIconWrapper: "rounded-full bg-primary/8 p-2 backdrop-blur-sm",
  badgeIcon: "h-6 w-6 text-primary",
  badgeText: "text-sm font-medium text-muted-foreground",
  cardContainer:
    "relative overflow-hidden rounded-2xl border-border/20 bg-card/95 backdrop-blur-xl shadow-lg",
  cardGlow:
    "absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-20 blur-xl",
  cardHeader: "text-center space-y-3 pb-6 px-8 pt-8",
  cardTitle:
    "text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
  cardDescription: "text-sm text-muted-foreground/80 leading-relaxed",
  cardContent: "pb-8 px-8",
  formContainer: "space-y-5",
  formItem: "relative",
  formItemContainer: "relative",
  floatingLabel: (isFocused: boolean, hasValue: boolean) =>
    `absolute left-3 z-10 transition-all duration-300 ${
      isFocused || hasValue
        ? "-top-2.5 text-xs bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-border/30 text-primary shadow-sm"
        : "top-3 text-sm text-muted-foreground"
    }`,
  inputContainer: "relative",
  inputBase:
    "h-12 rounded-lg border-border/30 bg-input-background/50 pl-3 pt-4 text-sm transition-all duration-300",
  inputFocus:
    "focus:border-primary/40 focus:bg-card/80 focus:shadow-sm focus:shadow-primary/5 focus:outline-none",
  inputPassword: "pr-10",
  passwordToggle:
    "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300 p-1.5 rounded-md hover:bg-primary/5",
  formMessage: "mt-1.5 text-xs",
  actionButtons: "flex gap-3",
  backButton:
    "h-11 rounded-lg border-border/40 bg-secondary/10 text-muted-foreground hover:bg-secondary/20 hover:text-secondary-foreground hover:border-border/60 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium",
  backButtonIcon: "h-4 w-4",
  submitButton:
    "h-11 rounded-lg text-primary-foreground " +
    "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] " +
    "transition-all duration-500 ease-in-out " +
    "shadow-sm hover:shadow-md " +
    "hover:bg-[linear-gradient(135deg,rgba(147,197,253,1),rgba(59,130,246,1))] " +
    "hover:brightness-[1.02] active:brightness-[0.98] " +
    "focus-visible:ring-2 focus-visible:ring-ring/50 " +
    "flex items-center justify-center gap-2 text-sm font-semibold",
  submitButtonLoading: "opacity-80 cursor-not-allowed",
  submitButtonIcon:
    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5",
  footerLinkContainer: "pt-4 text-center",
  footerLink:
    "inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors duration-300",
  footerLinkIcon: "mr-1.5 h-3.5 w-3.5",
  decorativeBorder:
    "absolute bottom-0 left-1/2 h-0.5 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent",
  footerContainer: "mt-6 text-center",
  footerText: "text-xs text-muted-foreground/60",
} as const;

// =========== Access Request ==============
export const accessRequestStyles = {
  mainContainer: "min-h-screen relative overflow-hidden bg-background",
  backgroundSpheres: "absolute inset-0 overflow-hidden",
  sphereBase: "absolute rounded-full",
  sphere1:
    "-left-40 top-1/4 h-96 w-96 bg-gradient-to-br from-amber-500/8 via-amber-400/4 to-transparent",
  sphere2:
    "-right-32 bottom-1/3 h-80 w-80 bg-gradient-to-tl from-orange-500/8 via-orange-400/4 to-transparent",
  sphere3:
    "left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400/4 via-amber-500/8 to-transparent",
  gridPattern:
    "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]",
  contentContainer:
    "container relative mx-auto flex min-h-screen items-center justify-center px-4 py-16",
  formWrapper: "w-full max-w-2xl",
  badgeContainer: "mb-8 flex items-center justify-center gap-2",
  badgeIconWrapper: "rounded-full bg-amber-500/8 p-2 backdrop-blur-sm",
  badgeIcon: "h-6 w-6 text-amber-500",
  badgeText: "text-sm font-medium text-muted-foreground",
  cardContainer:
    "relative overflow-hidden rounded-2xl border-border/20 bg-card/95 backdrop-blur-xl shadow-lg",
  cardGlow:
    "absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent opacity-20 blur-xl",
  cardHeader: "text-center space-y-3 pb-6 px-8 pt-8",
  cardTitle:
    "text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-400/80 bg-clip-text text-transparent",
  cardDescription: "text-sm text-muted-foreground/80 leading-relaxed",
  cardContent: "pb-8 px-8",
  formContainer: "grid gap-5 md:grid-cols-2",
  formItem: "relative",
  formItemContainer: "relative",
  formItemFullWidth: "md:col-span-2",
  floatingLabel: (isFocused: boolean, hasValue: boolean) =>
    `absolute left-3 z-10 transition-all duration-300 ${
      isFocused || hasValue
        ? "-top-2.5 text-xs bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-border/30 text-amber-500 shadow-sm"
        : "top-3 text-sm text-muted-foreground"
    }`,
  inputContainer: "relative",
  inputBase:
    "h-12 rounded-lg border-border/30 bg-input-background/50 pl-3 pt-4 text-sm transition-all duration-300",
  inputFocus:
    "focus:border-amber-500/40 focus:bg-card/80 focus:shadow-sm focus:shadow-amber-500/5 focus:outline-none",
  selectTrigger:
    "h-12 rounded-lg border-border/30 bg-input-background/50 data-[placeholder]:text-muted-foreground/60 text-sm transition-all duration-300 hover:bg-input-background/70",
  selectFocus:
    "focus:border-amber-500/40 focus:bg-card/80 focus:shadow-sm focus:shadow-amber-500/5",
  selectContent:
    "rounded-lg border-border/30 bg-card/95 backdrop-blur-xl shadow-lg",
  selectItem:
    "text-sm transition-colors duration-300 focus:bg-amber-500/10 focus:text-amber-500",
  formMessage: "mt-1.5 text-xs",
  errorMessage:
    "md:col-span-2 text-sm text-destructive bg-destructive/5 p-3 rounded-lg border border-destructive/20",
  submitButtonContainer: "md:col-span-2",
  submitButton:
    "h-11 rounded-lg text-primary-foreground " +
    "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))] " +
    "transition-all duration-500 ease-in-out " +
    "shadow-sm hover:shadow-md " +
    "hover:bg-[linear-gradient(135deg,rgba(147,197,253,1),rgba(59,130,246,1))] " +
    "hover:brightness-[1.02] active:brightness-[0.98] " +
    "focus-visible:ring-2 focus-visible:ring-ring/50 " +
    "flex items-center justify-center gap-2 text-sm font-semibold",
  submitButtonLoading: "opacity-80 cursor-not-allowed",
  submitButtonIcon:
    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5",
  decorativeBorder:
    "absolute bottom-0 left-1/2 h-0.5 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent",
  footerContainer: "mt-6 text-center",
  footerText: "text-xs text-muted-foreground/60",
} as const;
