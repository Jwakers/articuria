import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="py-4 px-6 shadow-sm sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/40 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          TableTopicsMaster
        </Link>
        <nav role="navigation" aria-label="Main navigation">
          <ul className="flex space-x-4">
            <li>
              <SignedOut>
                <Button variant="ghost" asChild>
                  <SignInButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
            <li>
              <SignedOut>
                <Button asChild>
                  <SignUpButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <Button variant="ghost" asChild>
                  <SignOutButton />
                </Button>
              </SignedIn>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
