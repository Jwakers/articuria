"use server";

import { api } from "@/convex/_generated/api";
import { getAccountLimits } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export async function getAuthToken() {
  return (await (await auth()).getToken({ template: "convex" })) ?? undefined;
}

// rename to getUser
export async function getUserServer() {
  const token = await getAuthToken();
  const user = await fetchQuery(api.users.current, undefined, {
    token,
  });
  if (!user) throw new Error("User not found");

  const accountLimits = getAccountLimits(user);

  return {
    user,
    accountLimits,
  };
}
