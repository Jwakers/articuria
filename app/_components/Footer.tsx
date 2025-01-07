import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} TableTopicsMaster. All rights reserved.
        </p>
        <nav role="navigation" aria-label="Footer navigation">
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/privacy"
                className="text-sm hover:opacity-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm hover:opacity-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
