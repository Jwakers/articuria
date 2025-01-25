import { SidebarProvider } from "@/components/ui/sidebar";
import type * as React from "react";
import { Header } from "./_components/header";
import DashboardSidebar from "./_components/sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="container px-4 pb-4">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
