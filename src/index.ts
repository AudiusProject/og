import { Hono } from "hono";
import { logger } from "hono/logger";
import { airdropRoute } from "./routes/airdrop";
import { commentRoute } from "./routes/comment";
import { trackRoute } from "./routes/track";

const app = new Hono()
  .use("*", logger())
  .route("/airdrop", airdropRoute)
  .route("/comment", commentRoute)
  .route("/track", trackRoute)
  .route("/og/comment", commentRoute); // Legacy route support

// Health check and info endpoint
app.get("/", async (c) => {
  return c.json({
    service: "Audius OG Image Generator",
    version: "1.0.0",
    endpoints: {
      airdrop: "/airdrop/:handle?",
      comment: "/comment/:id",
      track: "/track/:id",
      "comment (legacy)": "/og/comment/:id",
    },
    implemented: ["airdrop", "comment", "track"],
    comingSoon: ["user", "collection"],
  });
});

export default app;
