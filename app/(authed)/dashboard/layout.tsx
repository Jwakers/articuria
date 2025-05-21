import { Footer } from "@/components/footer";
import { SubscriptionBanner } from "@/components/subscription/subscription-banner";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import type * as React from "react";
import { Suspense } from "react";
import { Header } from "./_components/header";
import DashboardSidebar from "./_components/sidebar";
import { SubscriptionAlert } from "./_components/subscription-alert";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Button
        className="pointer-events-none fixed top-4 left-1/2 z-50 -translate-x-1/2 opacity-0 transition-opacity focus:pointer-events-auto focus:opacity-100"
        asChild
      >
        <a href="#main-content">Skip to content</a>
      </Button>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-4">
          <div className="grid h-full grid-rows-[1fr_auto]">
            <div>
              <Header />
              <div className="mb-4 space-y-4">
                <Suspense fallback={null}>
                  <SubscriptionAlert />
                </Suspense>
                <Suspense>
                  <SubscriptionBanner />
                </Suspense>
              </div>
              <div id="main-content">{children}</div>
            </div>
            <Footer className="pb-0" />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
