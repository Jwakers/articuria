const domain = process.env.CLERK_FRONTEND_API_URL;

if (!domain) {
  throw new Error("CLERK_FRONTEND_API_URL is not set");
}

export default {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
};
