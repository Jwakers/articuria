import { ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

export default function TableTopicsPage() {
  return redirect(ROUTES.dashboard.tableTopics.manage);
}
