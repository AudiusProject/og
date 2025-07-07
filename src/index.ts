import { Hono } from "hono";
import { logger } from "hono/logger";
import { airdropRoute } from "./airdrop";
import { commentRoute } from "./comment";

const app = new Hono()
  .use("*", logger())
  .route("/airdrop", airdropRoute)
  .route("/comment", commentRoute)
  .route("/og/comment", commentRoute); // Legacy route support

// Health check and info endpoint
app.get("/", async (c) => {
  return c.json({
    service: "Audius OG Image Generator",
    version: "1.0.0",
    endpoints: {
      airdrop: "/airdrop/:handle?",
      comment: "/comment/:id",
      "comment (legacy)": "/og/comment/:id",
    },
    implemented: ["airdrop", "comment"],
    comingSoon: ["track", "user", "collection"],
  });
});

export default app;
