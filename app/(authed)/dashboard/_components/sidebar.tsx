import { SubscriptionSidebarCard } from "@/components/subscription/subscription-sidebar-card";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserMenu from "@/components/user-menu";
import { Suspense } from "react";
import { SidebarMain, SidebarSupport } from "./sidebar-groups";

export default async function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMain />
        <div className="mt-auto">
          <SidebarSupport />
          <SidebarGroup>
            <Suspense fallback={null}>
              <SubscriptionSidebarCard />
            </Suspense>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
