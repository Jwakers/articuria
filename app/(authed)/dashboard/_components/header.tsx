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
      <Separator orientation="vertical" className="h-4 mr-1" />
      <Breadcrumbs />

      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
