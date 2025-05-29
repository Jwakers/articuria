"use client";

import { CreditCard, LogOut } from "lucide-react";

import { SignOutButton, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/hooks/use-user";
import { ROUTES } from "@/lib/constants";
import { BadgeCheck, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function UserMenu() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const subActive = user?.subscriptionData?.status === "active";

  const isMobile = useIsMobile();

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto w-full p-1">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.image} alt={fullName ?? ""} />
            <AvatarFallback className="rounded-lg">
              {user?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{fullName}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.image} alt={fullName ?? ""} />
              <AvatarFallback className="rounded-lg">
                {user?.firstName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{fullName}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => openUserProfile()}>
            <BadgeCheck />
            Manage account
          </DropdownMenuItem>
          {subActive ? (
            <DropdownMenuItem asChild>
              <Link href={ROUTES.dashboard.subscription}>
                <CreditCard />
                Manage subscription
              </Link>
            </DropdownMenuItem>
          ) : null}
          {/* <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
