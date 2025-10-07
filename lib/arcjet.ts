import _arcjet, { detectBot, shield } from "@arcjet/next";

export const arcjet = _arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    // Shield detects suspicious behavior, such as SQL injection and cross-site scripting attacks.
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
