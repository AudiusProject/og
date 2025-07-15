import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { PlayButton } from "../components/PlayButton";
import { ContentTag } from "../components/ContentTag";
import { Title } from "../components/Title";
import { UserName } from "../components/UserName";
import { Artwork } from "../components/Artwork";
import { getBadgeTier } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { APIService } from "../services/api";
import { getDominantColor } from "../utils/getDominantColor";

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
    const trackArtwork = track.artwork["480x480"];

    // Get dominant color from artwork
    const dominantColor = trackArtwork ? await getDominantColor(trackArtwork) : undefined;

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
          {trackArtwork && <Artwork src={trackArtwork} alt="Track Artwork" dominantColor={dominantColor} />}

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
              <ContentTag text="track" color={dominantColor} shadow />
              <AudiusLogoHorizontal height={40} shadow />
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
              <Title shadow>{track.title}</Title>
              <UserName
                name={artistName}
                shadow
                isVerified={isArtistVerified}
                tier={artistTier}
                backgroundColor={dominantColor}
              />
            </div>

            <PlayButton size={140} shadow />
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
