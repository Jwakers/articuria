"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ROUTES } from "@/lib/constants";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { ChevronUp, Menu } from "lucide-react";
import Link from "next/link";
import ManageAccountButton from "../(authed)/dashboard/_components/manage-account-button";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="py-4 px-6 shadow-sm sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/40 z-50">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link href={ROUTES.landing} className="text-2xl font-bold">
          TableTopics
        </Link>
        <nav role="navigation" aria-label="Main navigation">
          {!isMobile ? (
            <ul className="flex items-center space-x-4">
              <li className="flex">
                <SignedOut>
                  <Button variant="ghost" asChild>
                    <SignInButton />
                  </Button>
                  <Button asChild>
                    <SignUpButton />
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </li>
              <SignedIn>
                <li>
                  <Button asChild>
                    <Link href={ROUTES.dashboard.root}>Dashboard</Link>
                  </Button>
                </li>
              </SignedIn>
              <li>
                <ModeToggle />
              </li>
            </ul>
          ) : (
            <MobileMenu />
          )}
        </nav>
      </div>
    </header>
  );
}

function MobileMenu() {
  const { user } = useUser();

  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <Separator />
        <ul className="space-y-2">
          <SignedOut>
            <li>
              <SignInButton />
            </li>
            <li>
              <SignUpButton />
            </li>
          </SignedOut>
          <SignedIn>
            <li>
              <Link href={ROUTES.dashboard.root}>Dashboard</Link>
            </li>
          </SignedIn>
        </ul>
        <SheetFooter className="mt-auto gap-2">
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  {user?.hasImage ? (
                    <img
                      src={user.imageUrl}
                      className="aspect-square w-6 rounded-full"
                      alt="User image"
                    />
                  ) : null}
                  {user?.fullName}
                  <ChevronUp className="ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <ManageAccountButton />
                <SignOutButton>
                  <DropdownMenuItem className="cursor-pointer">
                    Sign out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <div className="self-end">
            <ModeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
