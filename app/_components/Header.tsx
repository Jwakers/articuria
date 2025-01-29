import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="py-4 px-6 shadow-sm sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/40 z-50">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link href={ROUTES.landing} className="text-2xl font-bold">
          TableTopicsMaster
        </Link>
        <nav role="navigation" aria-label="Main navigation">
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
        </nav>
      </div>
    </header>
  );
}
