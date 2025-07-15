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

interface PlaylistData {
  id?: string;
  playlist_name: string;
  artwork: Record<string, string>;
  user: UserInfo;
  is_album?: boolean;
}

interface PlaylistResponse {
  data?: PlaylistData[];
}

// Route definition
export const collectionRoute = new Hono().get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) return c.json({ error: "Missing playlist ID" }, 400);

    // Fetch playlist data using APIService
    const apiService = new APIService(c);
    const response: PlaylistResponse = await apiService.fetch(`/v1/full/playlists/${id}`);
    if (!response.data) return c.json({ error: "Playlist not found" }, 404);
    const playlist = response.data[0];

    // Prepare badge/verification
    const artistName = playlist.user.name;
    const isArtistVerified = playlist.user.is_verified;
    const artistTier = getBadgeTier(playlist.user.total_audio_balance);
    const playlistArtwork = playlist.artwork["480x480"];

    // Get dominant color from artwork
    const dominantColor = playlistArtwork ? await getDominantColor(playlistArtwork) : undefined;

    // Determine content type for tag
    const contentType = playlist.is_album ? "album" : "playlist";

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
          {playlistArtwork && <Artwork src={playlistArtwork} alt="Playlist Artwork" dominantColor={dominantColor} />}

          {/* Right Side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "32px",
              filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.1))",
              background: "transparent",
            }}
          >
            {/* Top Row: COLLECTION + Audius logo */}
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
              <ContentTag text={contentType} color={dominantColor} />
              <AudiusLogoHorizontal height={40} />
            </div>

            {/* Title & Artist Grouped with 24px gap */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "490px",
                marginBottom: "56px",
              }}
            >
              <Title shadow>{playlist.playlist_name}</Title>
              <UserName
                name={artistName}
                shadow
                isVerified={isArtistVerified}
                tier={artistTier}
                backgroundColor={dominantColor}
              />
            </div>

            {/* Play Button */}
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
    console.error("Collection OG Image generation error:", error);
    return c.json({ error: "Failed to generate collection image", details: error.message }, 500);
  }
});

export default collectionRoute;
