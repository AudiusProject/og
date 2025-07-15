import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { UserBadge } from "../components/UserBadge";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { APIService } from "../services/api";
import { getBadgeTier } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { getDominantColor } from "../utils/getDominantColor";

// Feature-specific types
interface UserInfo {
  id: string;
  name: string;
  is_verified: boolean;
  total_audio_balance: number;
  profile_picture: Record<string, string>;
}

interface TrackData {
  id: string;
  title: string;
  artwork: Record<string, string>;
  user: UserInfo;
}

// Feature-specific constants
const STYLES = {
  GRADIENT_BACKGROUND: "linear-gradient(-22deg, #5b23e1 0%, #a22feb 100%)",
  TEXT_FADE_GRADIENT:
    "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, 1) 100%)",
} as const;

const COLORS = {
  WHITE: "#FFF",
  TEXT_PRIMARY: "#524F62",
} as const;

// Route definition
export const commentRoute = new Hono().get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "Missing comment ID" }, 400);
    }
    return await renderCommentOGImage(c, id);
  } catch (error: any) {
    console.error("Comment OG Image generation error:", error);
    return c.json({ error: "Failed to generate comment image", details: error.message }, 500);
  }
});

// Render function
async function renderCommentOGImage(c: any, commentId: string) {
  const apiService = new APIService(c);

  // Feature-specific API call
  const { data, related } = await apiService.fetch<{ data: any; related: { tracks: TrackData[]; users: UserInfo[] } }>(
    `/v1/full/comments/${commentId}`,
  );
  const comment = Array.isArray(data) ? data[0] : data;

  if (!comment) throw new Error(`Failed to get comment ${commentId}`);

  const track = related.tracks.find((t: TrackData) => t.id === comment.entity_id);
  const user = related.users.find((u: UserInfo) => u.id === comment.user_id);

  if (!track) throw new Error(`Track not found for comment ${commentId}`);
  if (!user) throw new Error(`User not found for comment ${commentId}`);

  const trackName = track.title;
  const artistName = track.user.name;
  const isArtistVerified = track.user.is_verified;
  const artistTier = getBadgeTier(track.user.total_audio_balance);

  const commentText = comment.message;
  const commenterName = user.name;
  const isCommenterVerified = user.is_verified;
  const commenterTier = getBadgeTier(user.total_audio_balance);

  const trackArtwork = track.artwork["150x150"];
  const userProfilePicture = user.profile_picture["150x150"];

  const dominantColor = trackArtwork ? await getDominantColor(trackArtwork) : undefined;

  const renderContent = () => (
    <BaseLayout>
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "40px",
          justifyContent: "space-between",
          background: dominantColor ?? STYLES.GRADIENT_BACKGROUND,
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
          {trackArtwork && (
            <img
              src={trackArtwork}
              alt="Track Artwork"
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
                color: COLORS.WHITE,
                fontSize: "48px",
                fontWeight: "800",
                lineHeight: "54px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {trackName}
            </h2>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                  color: COLORS.WHITE,
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
                verifiedVariant="white"
                backgroundColor={dominantColor}
              />
            </div>
          </div>
        </div>
        <AudiusLogoHorizontal height={40} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: "100%",
          padding: "40px",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignContent: "center",
          }}
        >
          <div style={{ display: "flex", alignSelf: "flex-start", flexBasis: "128px" }}>
            {userProfilePicture && (
              <img
                src={userProfilePicture}
                alt="Profile Picture"
                height={128}
                width={128}
                style={{ width: "128px", height: "128px", borderRadius: "50%" }}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                  color: COLORS.TEXT_PRIMARY,
                  fontSize: "60px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "64px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {commenterName}
              </h2>
              <UserBadge isVerified={isCommenterVerified} tier={commenterTier} size={52} verifiedVariant="default" />
            </div>
            <p
              style={{
                margin: 0,
                color: COLORS.TEXT_PRIMARY,
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "72px",
                position: "relative",
              }}
            >
              {commentText}
              {/* Element to fade out text after 4 lines */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "360px",
                  background: STYLES.TEXT_FADE_GRADIENT,
                }}
              />
            </p>
          </div>
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
