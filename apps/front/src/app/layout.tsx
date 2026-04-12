import { StoreProvider } from "@/providers/StoreProvider";
import { AppProviders } from "@/providers/AppProvider";
import { ReactNode } from "react";
import { Metadata } from "next";
import { Toaster } from "@ui/sonner";

import ForcePasswordChangeEnforcer from "@modules/Auth/ForceChangePsswordEnforce";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fanous",
  description: "School & Talent Guidance Platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground antialiased transition-colors"
      >
        <StoreProvider>
          <AppProviders>
            <ForcePasswordChangeEnforcer />
            <Toaster />
            <Header />
            {children}
            <Footer />
          </AppProviders>
        </StoreProvider>
      </body>
    </html>
  );
}
