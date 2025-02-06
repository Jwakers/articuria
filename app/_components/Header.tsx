"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserMenu from "@/components/user-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { ROUTES } from "@/lib/constants";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
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
            <UserMenu />
          </SignedIn>
          <div className="self-end">
            <ModeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
