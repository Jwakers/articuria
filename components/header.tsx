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
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full py-4 backdrop-blur-sm md:absolute md:backdrop-blur-none">
      <div className="container mx-auto flex items-center justify-between">
        <Link href={ROUTES.landing} className="text-2xl font-bold">
          Articuria
        </Link>
        <nav role="navigation" aria-label="Main navigation">
          {!isMobile ? (
            <ul className="flex items-center space-x-4">
              <li className="flex gap-2">
                <Unauthenticated>
                  <Button variant="ghost" asChild>
                    <SignInButton mode="modal" />
                  </Button>
                  <Button asChild>
                    <SignUpButton mode="modal" />
                  </Button>
                </Unauthenticated>
                <Authenticated>
                  <UserButton />
                </Authenticated>
              </li>
              <Authenticated>
                <li>
                  <Button asChild>
                    <Link href={ROUTES.dashboard.root}>Dashboard</Link>
                  </Button>
                </li>
              </Authenticated>
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
          <Unauthenticated>
            <li>
              <SignInButton mode="modal" />
            </li>
            <li>
              <SignUpButton mode="modal" />
            </li>
          </Unauthenticated>
          <Authenticated>
            <li>
              <Link href={ROUTES.dashboard.root}>Dashboard</Link>
            </li>
          </Authenticated>
        </ul>
        <SheetFooter className="mt-auto gap-2">
          <Authenticated>
            <UserMenu />
          </Authenticated>
          <div className="self-end">
            <ModeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
