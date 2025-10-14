import { Hono } from "hono";
import { BaseLayout } from "../components/BaseLayout";
import { UserBadge } from "../components/UserBadge";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { ContentTag } from "../components/ContentTag";
import { getBadgeTier } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { APIService } from "../api";
import { sanitizeText } from "../utils/sanitizeText";
import { loadImage } from "../utils/loadImage";
import { getImageUrlWithFallback } from "../utils/fetchImageWithFallback";
import { createDiscordFriendlyImageResponse } from "../utils/imageResponse";
import { UserData, UserResponse } from "../types";

// Route definition
export const userRoute = new Hono().get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) return c.json({ error: "Missing user ID" }, 400);

    // Fetch user data using APIService
    const apiService = new APIService(c);
    const response: UserResponse = await apiService.fetch(`/v1/full/users/${id}`);
    if (!response.data) return c.json({ error: "User not found" }, 404);
    const user = response.data[0];

    // Prepare badge/verification
    const userName = sanitizeText(user.name);
    const userHandle = sanitizeText(user.handle);
    const isUserVerified = user.is_verified;
    const userTier = getBadgeTier(user.total_audio_balance);

    // Use mirror fallback for images
    const profilePicture = await getImageUrlWithFallback(user.profile_picture, "480x480");
    const coverPhoto = await getImageUrlWithFallback(user.cover_photo, "2000x");

    // Load fallback images only if needed
    const finalProfilePicture = profilePicture ?? (await loadImage(c, "/images/blank-profile-picture.png"))!;
    const finalCoverPhoto =
      coverPhoto ?? (profilePicture ? undefined : (await loadImage(c, "/images/blank-cover-photo.jpg"))!);

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
            flexDirection: "column",
            width: "1200px",
            height: "630px",
            background: "#FFFFFF",
          }}
        >
          {/* Cover Photo or Blurred Profile Background */}
          {finalCoverPhoto ? (
            <img
              src={finalCoverPhoto}
              alt="Cover Photo"
              width={1200}
              height={295}
              style={{
                width: "1200px",
                height: "295px",
                objectFit: "cover",
                borderBottom: "2px solid lightgray",
              }}
            />
          ) : profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile Background"
              width={1200}
              height={295}
              style={{
                width: "1200px",
                height: "295px",
                objectFit: "cover",
                filter: "blur(25px)",
                transform: "scale(1.1)",
                borderBottom: "2px solid rgba(255, 255, 255, 0.25)",
              }}
            />
          ) : null}

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
              padding: "32px",
              gap: "40px",
              width: "1200px",
              height: "295px",
              flex: 1,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "400px",
                height: "400px",
                borderRadius: "576.345px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: "#E7E7EA",
              }}
            >
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  borderRadius: "99999px",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  border: "2px solid lightgray",
                }}
              >
                <img
                  src={finalProfilePicture}
                  alt="Profile Picture"
                  width={400}
                  height={400}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            {/* User Info */}
            <div
              style={{
                display: "flex",
                flex: "1 0 0",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                alignSelf: "stretch",
                padding: "0px",
                gap: "16px",
              }}
            >
              {/* Profile Tag */}
              {user.profile_type === "label" ? (
                <ContentTag text="label" variant="dark" />
              ) : typeof user.track_count === "number" && user.track_count > 0 ? (
                <ContentTag text="artist" variant="dark" />
              ) : null}

              {/* Name and Badges */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "0px",
                  gap: "8px",
                  width: "100%",
                }}
              >
                {/* Name Row */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Avenir Next LT Pro",
                      fontStyle: "normal",
                      fontWeight: 800,
                      fontSize: "44px",
                      lineHeight: "52px",
                      color: "#524F62",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {userName}
                  </span>
                  <UserBadge isVerified={isUserVerified} tier={userTier} size={40} verifiedVariant="default" />
                </div>
                {/* Handle Row */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Avenir Next LT Pro",
                      fontStyle: "normal",
                      fontWeight: 700,
                      fontSize: "28px",
                      lineHeight: "36px",
                      color: "#736E88",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    @{userHandle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audius Logo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              height: "48px",
            }}
          >
            <div style={{ display: "flex", position: "absolute", bottom: "24px", right: "24px" }}>
              <AudiusLogoHorizontal height={40} variant="dark" />
            </div>
          </div>
        </div>
      </BaseLayout>
    );

    return createDiscordFriendlyImageResponse(renderContent(), {
      width: 1200,
      height: 630,
      fonts: Array.isArray(font) ? [...font] : [font],
    });
  } catch (error: any) {
    console.error("User OG Image generation error:", error);
    return c.json({ error: "Failed to generate user image", details: error.message }, 500);
  }
});

export default userRoute;
