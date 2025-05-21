import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Link from "next/link";

export function Footer({ className }: { className?: ClassValue }) {
  return (
    <footer className={cn("py-6", className)}>
      <div
        className={cn(
          "mx-auto flex items-center justify-between",
          !className && "container",
        )}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} Articuria. All rights reserved.
        </p>
        <nav role="navigation" aria-label="Footer navigation">
          <ul className="flex space-x-4">
            <li>
              <Link
                href={ROUTES.privacy}
                className="focus-visible:ring-ring text-sm transition-colors hover:opacity-60 focus-visible:ring-2 focus-visible:outline-hidden"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.terms}
                className="focus-visible:ring-ring text-sm transition-colors hover:opacity-60 focus-visible:ring-2 focus-visible:outline-hidden"
                aria-label="Terms of Service"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
