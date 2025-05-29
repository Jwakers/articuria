"use server";

import { api } from "@/convex/_generated/api";
import { getAccountLimits } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export async function getAuthToken() {
  return (await (await auth()).getToken({ template: "convex" })) ?? undefined;
}

export async function getUser() {
  const token = await getAuthToken();
  const user = await fetchQuery(api.users.current, undefined, {
    token,
  });

  if (!user) return { user: null, accountLimits: null };

  const accountLimits = getAccountLimits(user);

  return {
    user,
    accountLimits,
  };
}
