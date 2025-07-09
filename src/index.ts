import { Hono } from "hono";
import { logger } from "hono/logger";
import { airdropRoute } from "./routes/airdrop";
import { commentRoute } from "./routes/comment";
import { trackRoute } from "./routes/track";
import { collectionRoute } from "./routes/collection";
import { userRoute } from "./routes/user";

const app = new Hono()
  .use("*", logger())
  .route("/airdrop", airdropRoute)
  .route("/comment", commentRoute)
  .route("/track", trackRoute)
  .route("/collection", collectionRoute)
  .route("/user", userRoute)
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
      collection: "/collection/:id",
      user: "/user/:id",
      "comment (legacy)": "/og/comment/:id",
    },
    implemented: ["airdrop", "comment", "track", "collection", "user"],
  });
});

export default app;
