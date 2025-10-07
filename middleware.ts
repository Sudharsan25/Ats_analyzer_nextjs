// middleware.ts
import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * This prevents the middleware from running on asset requests.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Protect against common bots
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
      ],
    }),
  ],
});

export default createMiddleware(aj);
