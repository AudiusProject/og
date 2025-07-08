import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { UserBadge } from "../components/UserBadge";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { getBadgeTier, getBadgeIconPath } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { loadImage } from "../utils/loadImage";
import { APIService } from "../services/api";

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

// Feature-specific constants
const ICON_PATHS = {
  AUDIUS_LOGO: "/icons/AudiusLogoHorizontal.svg",
  VERIFIED_WHITE: "/icons/VerifiedWhite.svg",
} as const;

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

    // Debug logging for artwork
    console.log("track.artwork:", track.artwork);

    // Prepare badge/verification
    const artistName = track.user.name;
    const isArtistVerified = track.user.is_verified;
    const artistTier = getBadgeTier(track.user.total_audio_balance);
    // Use the external artwork URL directly
    const trackArtwork = track.artwork["1000x1000"];
    // Only use loadImage for local assets
    const [audiusLogo, verifiedIconWhite, artistTierIcon] = await Promise.all([
      loadImage(c, ICON_PATHS.AUDIUS_LOGO),
      isArtistVerified ? loadImage(c, ICON_PATHS.VERIFIED_WHITE) : null,
      artistTier ? loadImage(c, getBadgeIconPath(artistTier)!) : null,
    ]);

    // Debug logging for loaded artwork
    console.log("trackArtwork:", trackArtwork);

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
            {trackArtwork && (
              <img
                src={trackArtwork}
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
            {/* Top Row: TRACK + Audius logo */}
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
              <div
                style={{
                  background: "#fff",
                  borderRadius: "4px",
                  padding: "8px",
                  fontWeight: 800,
                  fontSize: "22px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "#000",
                  fontFamily: "Avenir Next LT Pro",
                }}
              >
                track
              </div>
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
              {track.title}
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
              <UserBadge
                isVerified={isArtistVerified}
                tier={artistTier}
                size={32}
                verifiedIconWhite={verifiedIconWhite || undefined}
                tierIcon={artistTierIcon || undefined}
              />
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
              <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140" fill="none">
                <g clipPath="url(#clip0_188_519)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M70 0C108.66 0 140 31.3401 140 70C140 108.66 108.66 140 70 140C31.3401 140 0 108.66 0 70C0 31.3401 31.3401 0 70 0ZM56.875 43.1249C54.4588 43.1249 52.5 45.0837 52.5 47.4999V92.4992C52.5 93.1916 52.6643 93.8741 52.9795 94.4906C54.0793 96.642 56.7149 97.4945 58.8664 96.3947L102.88 73.8951C103.699 73.4764 104.365 72.8102 104.784 71.991C105.884 69.8396 105.031 67.2039 102.88 66.1041L58.8664 43.6044C58.2499 43.2893 57.5674 43.1249 56.875 43.1249Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_188_519">
                    <rect width="140" height="140" fill="white" />
                  </clipPath>
                </defs>
              </svg>
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
    console.error("Track OG Image generation error:", error);
    return c.json({ error: "Failed to generate track image", details: error.message }, 500);
  }
});

export default trackRoute;
