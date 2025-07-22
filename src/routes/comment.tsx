import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { Title } from "../components/Title";
import { UserName } from "../components/UserName";
import { Artwork } from "../components/Artwork";
import { APIService } from "../api";
import { getBadgeTier } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { getDominantColor } from "../utils/getDominantColor";
import { sanitizeText } from "../utils/sanitizeText";
import { loadImage } from "../utils/loadImage";
import { UserBadge } from "../components/UserBadge";
import { blendWithWhite } from "../utils/blendWithWhite";

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

  const commentText = sanitizeText(comment.message);
  const commenterName = user.name;
  const isCommenterVerified = user.is_verified;
  const commenterTier = getBadgeTier(user.total_audio_balance);

  const trackArtwork = track.artwork["150x150"];
  const userProfilePicture = user.profile_picture["150x150"];

  // Load fallback images
  const fallbackProfilePic = await loadImage(c, "/images/blank-profile-picture.png");
  const fallbackArtwork = await loadImage(c, "/images/blank-artwork.png");
  const finalUserProfilePicture = userProfilePicture || fallbackProfilePic || undefined;
  const finalArtwork = trackArtwork || fallbackArtwork!;

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
          borderBottom: dominantColor
            ? `2px solid ${blendWithWhite(dominantColor.replace("#", ""), 0.1)}`
            : "2px solid #FFF",
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
          <Artwork src={finalArtwork} alt="Track Artwork" size={120} dominantColor={dominantColor} />
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
            <Title
              style={{
                fontSize: "48px",
                lineHeight: "54px",
                margin: 0,
                width: "auto",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {trackName}
            </Title>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <p
                style={{
                  margin: 0,
                  color: COLORS.WHITE,
                  fontSize: "40px",
                  fontWeight: "500",
                  lineHeight: "48px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  // gap is needed to fix text ellipsis
                  gap: "8px",
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
            <div
              style={{
                width: "128px",
                height: "128px",
                borderRadius: "50%",
                backgroundColor: "#E7E7EA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "6.4px solid #EFEFF1",
              }}
            >
              <img
                src={finalUserProfilePicture}
                alt="Profile Picture"
                height={128}
                width={128}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0",
              gap: "16px",
            }}
          >
            <UserName
              name={commenterName}
              isVerified={isCommenterVerified}
              tier={commenterTier}
              badgeSize={52}
              verifiedVariant="default"
              color={COLORS.TEXT_PRIMARY}
              style={{ fontSize: "60px", fontWeight: "700" }}
            />
            <p
              style={{
                margin: 0,
                color: COLORS.TEXT_PRIMARY,
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "72px",
                position: "relative",
                wordBreak: "break-word",
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
