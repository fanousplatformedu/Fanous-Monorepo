import { AppSidebarResponsive } from "@/components/layouts/SidebarLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebarResponsive />
      <div className="flex-1 flex flex-col">
        {/* Header, main content, etc. */}
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
