import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbs from "./breadcrumbs";

export function Header() {
  return (
    <header
      className="flex min-h-16 items-center gap-2 md:gap-4"
      role="banner"
      aria-label="Dashboard header"
    >
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <Breadcrumbs />

      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
