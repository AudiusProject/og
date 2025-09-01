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
import { APIService } from "../api";
import { getDominantColor } from "../utils/getDominantColor";
import { loadImage } from "../utils/loadImage";

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

    // Load fallback artwork only if needed
    const finalArtwork = trackArtwork || (await loadImage(c, "/images/blank-artwork.png"))!;

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
            padding: "12px",
            gap: "12px",
            width: "800px",
            height: "420px",
            boxSizing: "border-box",
            background: dominantColor || "#000",
          }}
        >
          {/* Artwork */}
          <Artwork src={finalArtwork} alt="Track Artwork" dominantColor={dominantColor} size={396} />

          {/* Right Side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "20px",
              width: "372px",
              height: "396px",
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
                width: "332px",
                height: "28px",
                marginBottom: "36px",
              }}
            >
              <ContentTag text="track" color={dominantColor} />
              <AudiusLogoHorizontal height={28} />
            </div>

            {/* Title & Artist Grouped with 16px gap */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "332px",
                marginBottom: "36px",
              }}
            >
              <Title>{track.title}</Title>
              <UserName
                name={artistName}
                isVerified={isArtistVerified}
                tier={artistTier}
                backgroundColor={dominantColor}
                badgeSize={22}
              />
            </div>

            <PlayButton size={100} />
          </div>
        </div>
      </BaseLayout>
    );

    const imageResponse = new ImageResponse(renderContent(), {
      width: 800,
      height: 420,
      fonts: Array.isArray(font) ? [...font] : [font],
              headers: {
          'content-type': 'image/png',
          'cache-control': 'public, max-age=31536000, immutable',
          'content-encoding': 'gzip', // Enable compression hint
        },
    });
    return imageResponse;
  } catch (error: any) {
    console.error("Track OG Image generation error:", error);
    return c.json({ error: "Failed to generate track image", details: error.message }, 500);
  }
});

export default trackRoute;
