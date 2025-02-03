import { Button } from "@/components/ui/button";
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
    <>
      <Button
        className="fixed top-4 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none focus:pointer-events-auto focus:opacity-100 z-50 transition-opacity"
        asChild
      >
        <a href="#main-content">Skip to content</a>
      </Button>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="w-full px-4 pb-4 max-w-[1440px] mx-auto">
          <Header />
          <div id="main-content">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
}
