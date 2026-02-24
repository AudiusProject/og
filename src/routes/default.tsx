import { Hono } from "hono";

const DEFAULT_OG_IMAGE = "/images/og-default.png";

/**
 * Serves the default Audius OG image (logo on black) directly.
 * We stream the asset instead of rendering via ImageResponse because
 * Satori does not reliably render data URLs in img src, which caused a blank image.
 */
export const defaultRoute = new Hono().get("/", async (c) => {
  try {
    if (!c.env?.ASSETS) {
      return c.json({ error: "ASSETS binding is not configured" }, 500);
    }
    const imageUrl = new URL(DEFAULT_OG_IMAGE, c.req.url).toString();
    const imageResponse = await c.env.ASSETS.fetch(imageUrl);
    if (!imageResponse.ok) {
      return c.json({ error: "Default OG image not found" }, 404);
    }
    const contentType = imageResponse.headers.get("content-type") ?? "image/png";
    const body = await imageResponse.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    console.error("Default OG Image serve error:", error);
    return c.json(
      {
        error: "Failed to serve default OG image",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});
