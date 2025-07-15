import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { UserBadge } from "../components/UserBadge";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { PlayButton } from "../components/PlayButton";
import { ContentTag } from "../components/ContentTag";
import { getBadgeTier } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { loadImage } from "../utils/loadImage";
import { APIService } from "../services/api";
import { getDominantColor } from "../utils/getDominantColor";
import { blendWithWhite } from "../utils/blendWithWhite";

// Feature-specific types
interface UserInfo {
  id?: string;
  name: string;
  is_verified: boolean;
  total_audio_balance: number;
  profile_picture?: Record<string, string>;
}

interface TrackData {
  id?: string;
  title: string;
  artwork: Record<string, string>;
  user: UserInfo;
}

interface TrackResponse {
  data?: TrackData;
}

// Route definition
export const trackRoute = new Hono().get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) return c.json({ error: "Missing track ID" }, 400);

    // Fetch track data using APIService
    const apiService = new APIService(c);
    const response: TrackResponse = await apiService.fetch(`/v1/full/tracks/${id}`);
    if (!response.data) return c.json({ error: "Track not found" }, 404);
    const track = response.data;

    // Prepare badge/verification
    const artistName = track.user.name;
    const isArtistVerified = track.user.is_verified;
    const artistTier = getBadgeTier(track.user.total_audio_balance);
    const trackArtwork = track.artwork["1000x1000"];

    // Get dominant color from artwork
    const dominantColor = trackArtwork ? await getDominantColor(trackArtwork) : undefined;
    console.log("dominantColor", dominantColor);

    // Load fonts
    const font = await getLocalFonts(c, [
      { path: "Inter-Bold.ttf", weight: 700 },
      { path: "Inter-Regular.ttf", weight: 500 },
      { path: "Inter-Light.ttf", weight: 300 },
    ]);

    // Render OG image
    const renderContent = () => (
      <BaseLayout>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "16px",
            gap: "16px",
            width: "1200px",
            height: "630px",
            boxSizing: "border-box",
            background: dominantColor || "#000",
          }}
        >
          {/* Artwork */}
          <div
            style={{
              width: "598px",
              height: "598px",
              backgroundColor: "#E7E7EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0px 100px 80px rgba(0,0,0,0.07), 0px 41.78px 33.42px rgba(0,0,0,0.05), 0px 22.34px 17.87px rgba(0,0,0,0.04), 0px 12.52px 10.02px rgba(0,0,0,0.035), 0px 6.65px 5.32px rgba(0,0,0,0.028), 0px 2.77px 2.21px rgba(0,0,0,0.02)",
              position: "relative",
              overflow: "hidden",
              border: dominantColor
                ? `2px solid ${blendWithWhite(dominantColor.replace("#", ""), 0.1)}`
                : "2px solid #FFF",
              borderRadius: "24px",
            }}
          >
            {trackArtwork && (
              <img
                src={trackArtwork}
                alt="Artwork"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </div>

          {/* Right Side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "32px",
              width: "554px",
              height: "598px",
              filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.1))",
              background: "transparent",
            }}
          >
            {/* Top Row: TRACK + Audius logo */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "490px",
                height: "40px",
                marginBottom: "56px",
              }}
            >
              <ContentTag text="track" color={dominantColor} />
              <AudiusLogoHorizontal height={40} />
            </div>

            {/* Title & Artist Grouped with 24px gap */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "490px",
                marginBottom: "56px",
              }}
            >
              <div
                style={{
                  width: "490px",
                  fontWeight: 800,
                  fontSize: "40px",
                  lineHeight: "49px",
                  color: "#fff",
                  fontFamily: "Avenir Next LT Pro",
                  overflow: "hidden",
                  marginBottom: "24px",
                  maxHeight: "147px", // 3 * 49px lineHeight
                  // No ellipsis, just cut off after 3 lines
                }}
              >
                {track.title}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                  height: "39px",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "32px",
                    color: "#fff",
                    fontFamily: "Avenir Next LT Pro",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {artistName}
                </span>
                <UserBadge
                  isVerified={isArtistVerified}
                  tier={artistTier}
                  size={32}
                  verifiedVariant="white"
                  backgroundColor={dominantColor}
                />
              </div>
            </div>

            <PlayButton size={140} />
          </div>
        </div>
      </BaseLayout>
    );

    return new ImageResponse(renderContent(), {
      width: 1200,
      height: 630,
      fonts: Array.isArray(font) ? [...font] : [font],
    });
  } catch (error: any) {
    console.error("Track OG Image generation error:", error);
    return c.json({ error: "Failed to generate track image", details: error.message }, 500);
  }
});

export default trackRoute;
