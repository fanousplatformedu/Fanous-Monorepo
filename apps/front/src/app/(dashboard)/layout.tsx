import { ReactNode } from "react";

/**
 * The root layout (src/app/layout.tsx) already provides <html>/<body>,
 * the store + app providers, the site <Header />, and the toaster.
 *
 * Do NOT re-render any of those here: a second <html>/<body> and a second
 * <Header /> would stack on top of the root ones (causing two headers to
 * paint over each other) and a second LanguageProvider would race with the
 * root one over the shared localStorage key, flipping the app back to "en".
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
