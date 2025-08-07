"use client";

import { api } from "@/convex/_generated/api";
import { getAccountLimits } from "@/convex/utils";
import { useQuery } from "convex/react";

export function useUser() {
  const user = useQuery(api.users.current);

  if (!user) return { user: null, accountLimits: null };

  const accountLimits = getAccountLimits(user);

  return {
    user,
    accountLimits,
  };
}
