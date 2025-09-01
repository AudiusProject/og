import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { APIService } from "../api";
import { getLocalFonts } from "../utils/getFonts";
import { loadImage } from "../utils/loadImage";

// Feature-specific types
interface UserData {
  data?: {
    id: string;
  };
}

interface Challenge {
  challenge_id: string;
  current_step_count: number;
}

interface ChallengeData {
  data?: Challenge[];
}

// Feature-specific constants
const AIRDROP_BACKGROUND = "/images/airdrop.png";

// Route definition
export const airdropRoute = new Hono().get("/:handle?", async (c) => {
  try {
    const handle = c.req.param("handle");
    return await renderAirdropOGImage(c, handle);
  } catch (error: any) {
    console.error("Airdrop OG Image generation error:", error);
    return c.json({ error: "Failed to generate airdrop image", details: error.message }, 500);
  }
});

// Render function
async function renderAirdropOGImage(c: any, handle?: string) {
  const apiService = new APIService(c);
  const totalAllocation = handle ? await apiService.fetchAllocation(handle) : null;

  const firstLine = handle ? `@${handle}` : "";
  const secondLine =
    totalAllocation !== null ? `${Number(totalAllocation).toLocaleString()} $AUDIO` : "Airdrop 2: Artist Appreciation";

  const font = await getLocalFonts(c, [{ path: "Inter-Bold.ttf", weight: 700 }]);
  const backgroundImage = await loadImage(c, AIRDROP_BACKGROUND);

  const renderContent = () => (
    <BaseLayout backgroundImage={backgroundImage || undefined}>
      <div
        style={{
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
            paddingLeft: "300px",
          }}
        >
          <div tw="text-7xl font-bold text-white text-left mb-4">{firstLine}</div>
          <div tw="text-7xl font-bold text-white text-left">{secondLine}</div>
        </div>
      </div>
    </BaseLayout>
  );

  return new ImageResponse(renderContent(), {
    width: 800,  // Reduced from 1200 (33% reduction)
    height: 420, // Reduced from 630 (33% reduction) 
    fonts: Array.isArray(font) ? [...font] : [font],
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=31536000, immutable',
      'content-encoding': 'gzip', // Enable compression hint
    },
  });
}
