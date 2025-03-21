import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import type * as React from "react";
import { Header } from "./_components/header";
import DashboardSidebar from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your videos and account",
};

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Button
        className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2 opacity-0 transition-opacity focus:pointer-events-auto focus:opacity-100"
        asChild
      >
        <a href="#main-content">Skip to content</a>
      </Button>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-4">
          <Header />
          <div id="main-content">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
}
