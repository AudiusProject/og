import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { UserBadge } from "../components/UserBadge";
import { APIService } from "../services/api";
import { getBadgeTier, getBadgeIconPath } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { loadImage } from "../utils/loadImage";
// Feature-specific types
interface UserInfo {
  id: string;
  name: string;
  is_verified: boolean;
  total_audio_balance: number;
  profile_picture: Record<string, string>;
}

interface ItemData {
  id: string;
  title: string;
  artwork: Record<string, string>;
  user: UserInfo;
}

// Feature-specific constants
const ICON_PATHS = {
  AUDIUS_LOGO: "/icons/AudiusLogoHorizontal.svg",
  VERIFIED_WHITE: "/icons/VerifiedWhite.svg",
} as const;

const STYLES = {
  GRADIENT_BACKGROUND: "linear-gradient(-22deg, #5b23e1 0%, #a22feb 100%)",
} as const;

// Route definition
export const templateRoute = new Hono().get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "Missing ID" }, 400);
    }
    return await renderTemplateOGImage(c, id);
  } catch (error: any) {
    console.error("Template OG Image generation error:", error);
    return c.json({ error: "Failed to generate template image", details: error.message }, 500);
  }
});

// Render function
async function renderTemplateOGImage(c: any, id: string) {
  const apiService = new APIService(c);

  // TODO: Replace with actual API call when implementing
  // const { data: item, related } = await apiService.fetch<{ data: any; related: any }>(`/v1/full/[type]s/${id}`);
  const item = {
    title: "Example Title",
    user: { name: "Example Artist", is_verified: false, total_audio_balance: 0 },
    artwork: { "150x150": "" },
  };
  const related = {};

  const itemName = item.title;
  const artistName = item.user.name;
  const isArtistVerified = item.user.is_verified;
  const artistTier = getBadgeTier(item.user.total_audio_balance);

  const [itemArtwork, audiusLogo, verifiedIconWhite, artistTierIcon] = await Promise.all([
    loadImage(c, item.artwork["150x150"]),
    loadImage(c, ICON_PATHS.AUDIUS_LOGO),
    isArtistVerified ? loadImage(c, ICON_PATHS.VERIFIED_WHITE) : null,
    artistTier ? loadImage(c, getBadgeIconPath(artistTier)!) : null,
  ]);

  const renderContent = () => (
    <BaseLayout>
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "40px",
          justifyContent: "space-between",
          background: "linear-gradient(-22deg, #5b23e1 0%, #a22feb 100%)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1 1 0",
            flexDirection: "row",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {itemArtwork && (
            <img
              src={itemArtwork}
              alt="Item Artwork"
              height={120}
              width={120}
              style={{ width: "120px", height: "120px", borderRadius: "10px" }}
            />
          )}
          <div
            style={{
              display: "flex",
              flex: "1 1 0",
              flexDirection: "column",
              gap: "4px",
              height: "120px",
              paddingTop: "4px",
              alignSelf: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#FFF",
                fontSize: "48px",
                fontWeight: "800",
                lineHeight: "54px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {itemName}
            </h2>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                  color: "#FFF",
                  fontSize: "40px",
                  fontWeight: "300",
                  lineHeight: "48px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                By {artistName}
              </p>
              <UserBadge
                isVerified={isArtistVerified}
                tier={artistTier}
                size={32}
                verifiedIconWhite={verifiedIconWhite || undefined}
                tierIcon={artistTierIcon || undefined}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignSelf: "flex-start", width: "200px" }}>
          {audiusLogo && <img src={audiusLogo} alt="Audius Logo" height={48} width={200} style={{ width: "200px" }} />}
        </div>
      </div>
    </BaseLayout>
  );

  const font = await getLocalFonts(c, [
    { path: "Inter-Bold.ttf", weight: 700 },
    { path: "Inter-Regular.ttf", weight: 500 },
    { path: "Inter-Light.ttf", weight: 300 },
  ]);

  return new ImageResponse(renderContent(), {
    width: 1200,
    height: 630,
    fonts: Array.isArray(font) ? [...font] : [font],
  });
}
