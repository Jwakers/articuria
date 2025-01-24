import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type * as React from "react";
import DashboardSidebar from "./_components/sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="container md:ml-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
