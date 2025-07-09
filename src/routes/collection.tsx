import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { UserBadge } from "../components/UserBadge";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { PlayButton } from "../components/PlayButton";
import { ContentTag } from "../components/ContentTag";
import { getBadgeTier } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { APIService } from "../services/api";

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
    const playlistArtwork = playlist.artwork["1000x1000"];

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
            background: "#000",
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
              borderRadius: "24px",
            }}
          >
            {playlistArtwork && (
              <img
                src={playlistArtwork}
                alt="Artwork"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "24px",
                }}
              />
            )}
          </div>

          {/* Right Side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: "32px",
              gap: "56px",
              width: "554px",
              height: "598px",
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
                gap: "8px",
              }}
            >
              <ContentTag text={contentType} />
              <AudiusLogoHorizontal height={40} />
            </div>

            {/* Title */}
            <div
              style={{
                width: "490px",
                fontWeight: 800,
                fontSize: "40px",
                lineHeight: "49px",
                color: "#fff",
                marginTop: "24px",
                fontFamily: "Avenir Next LT Pro",
              }}
            >
              {playlist.playlist_name}
            </div>

            {/* Artist + Badges */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
                height: "39px",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "32px", color: "#fff", fontFamily: "Avenir Next LT Pro" }}>
                {artistName}
              </span>
              <UserBadge isVerified={isArtistVerified} tier={artistTier} size={32} verifiedVariant="white" />
            </div>

            {/* Play Button */}
            <div
              style={{
                width: "140px",
                height: "140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayButton size={140} />
            </div>
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
