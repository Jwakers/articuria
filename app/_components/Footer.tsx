import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 px-6 bg-background text-white">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} TableTopicsMaster. All rights reserved.
        </p>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/privacy"
                className="text-sm hover:opacity-60 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm hover:opacity-60 transition-colors"
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
