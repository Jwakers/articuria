import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          © {new Date().getFullYear()} Articuria. All rights reserved.
        </p>
        <nav role="navigation" aria-label="Footer navigation">
          <ul className="flex space-x-4">
            <li>
              <Link
                href={ROUTES.privacy}
                className="text-sm transition-colors hover:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.terms}
                className="text-sm transition-colors hover:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
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
