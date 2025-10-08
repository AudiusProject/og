import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { loadImage } from "../utils/loadImage";

// Feature-specific constants
const COINS_BACKGROUND = "/images/coins.png";

// Route definition
export const coinsRoute = new Hono().get("/", async (c) => {
  try {
    return await renderCoinsOGImage(c);
  } catch (error: any) {
    console.error("Coins OG Image generation error:", error);
    return c.json({ error: "Failed to generate coins image", details: error.message }, 500);
  }
});

// Render function
async function renderCoinsOGImage(c: any) {
  const backgroundImage = await loadImage(c, COINS_BACKGROUND);

  const renderContent = () => (
    <BaseLayout backgroundImage={backgroundImage || undefined}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      />
    </BaseLayout>
  );

  return new ImageResponse(renderContent(), {
    width: 1200,
    height: 630,
  });
}
