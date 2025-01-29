"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";

export default function ManageAccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => openUserProfile()}
    >
      Manage account
    </DropdownMenuItem>
  );
}
