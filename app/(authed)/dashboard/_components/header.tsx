import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbs from "./breadcrumbs";

export function Header() {
  return (
    <header className="flex h-16 items-center gap-2">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4 mr-1" />
      <Breadcrumbs />
    </header>
  );
}
