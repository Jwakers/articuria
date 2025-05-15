"use client";

import { Home, Mic, Send } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === ROUTES.dashboard.root}
            >
              <Link href={ROUTES.dashboard.root}>
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <Mic />
                  <span>Table Topics</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem className="w-full">
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === ROUTES.dashboard.tableTopics.record
                      }
                    >
                      <Link
                        href={ROUTES.dashboard.tableTopics.record}
                        className="block w-full hover:underline"
                      >
                        Record
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === ROUTES.dashboard.tableTopics.manage
                      }
                    >
                      <Link
                        href={ROUTES.dashboard.tableTopics.manage}
                        className="block w-full hover:underline"
                      >
                        Manage recordings
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function SidebarSupport() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              closeMobile
              isActive={pathname === ROUTES.dashboard.contact}
            >
              <Link href={ROUTES.dashboard.contact}>
                <Send />
                Contact us
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
