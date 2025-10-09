import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { BaseLayout } from "../components/BaseLayout";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { VerifiedIcon } from "../components/VerifiedIcon";
import { getLocalFonts } from "../utils/getFonts";
import { APIService } from "../api";
import { loadImage } from "../utils/loadImage";
import { getImageUrlWithFallback } from "../utils/fetchImageWithFallback";
import { CoinResponse, UserResponse } from "../types";
import { sanitizeText } from "../utils/sanitizeText";

// Route definition
export const coinRoute = new Hono().get("/:ticker", async (c) => {
  try {
    const ticker = c.req.param("ticker");
    if (!ticker) return c.json({ error: "Missing ticker" }, 400);

    // Fetch coin data using APIService
    const apiService = new APIService(c);
    const response: CoinResponse = await apiService.fetch(`/v1/coins/ticker/${ticker}`);
    if (!response.data) return c.json({ error: "Coin not found" }, 404);
    const coin = response.data;

    // Fetch user data using owner_id
    const userResponse: UserResponse = await apiService.fetch(`/v1/full/users/${coin.owner_id}`);
    if (!userResponse.data || userResponse.data.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }
    const user = userResponse.data[0];

    // Prepare coin data
    const coinName = coin.name || coin.ticker || coin.symbol || ticker;
    const coinTicker = coin.name ? coin.ticker || coin.symbol || `$${ticker}` : null;
    const coinLogo = coin.logo_uri;

    // Prepare user data with mirror fallback
    const artistName = sanitizeText(user.name);
    const artistProfilePicture = await getImageUrlWithFallback(user.profile_picture, "480x480");
    const artistCoverPhoto = await getImageUrlWithFallback(user.cover_photo, "2000x");
    const isUserVerified = user.is_verified;

    const border = await loadImage(c, "/images/coin-border.png");
    // Load fallback images if needed
    const finalCoinLogo = coinLogo ?? (await loadImage(c, "/icons/TokenGold.svg"))!;
    const finalProfilePicture = artistProfilePicture ?? (await loadImage(c, "/images/blank-profile-picture.png"))!;
    const finalCoverPhoto =
      artistCoverPhoto ?? (artistProfilePicture ? undefined : (await loadImage(c, "/images/blank-cover-photo.jpg"))!);

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
            boxSizing: "border-box",
            background: "#FFFFFF",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Cover Photo or Blurred Profile Background */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              height: "315px",
            }}
          >
            {finalCoverPhoto ? (
              <img
                src={finalCoverPhoto}
                alt="Cover Photo"
                width={1200}
                height={315}
                style={{
                  width: "1200px",
                  height: "315px",
                  objectFit: "cover",
                  borderBottom: "2px solid lightgray",
                }}
              />
            ) : artistProfilePicture ? (
              <img
                src={artistProfilePicture}
                alt="Profile Background"
                width={1200}
                height={315}
                style={{
                  width: "1200px",
                  height: "315px",
                  objectFit: "cover",
                  borderBottom: "2px solid lightgray",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #1E3A8A 0%, #000000 100%)",
                }}
              />
            )}

            {/* Artist Info Pill */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFFFFF",
                borderRadius: "240px",
                padding: "12px 24px 12px 12px",
                gap: "12px",
                border: "3px solid #EFEFF1",
                // boxShadow: "0px 0px 18px 0px rgba(0,0,0,0.02), 0px 6px 12px 0px rgba(0,0,0,0.08)",
              }}
            >
              {/* Artist Profile Picture */}
              <div
                style={{
                  display: "flex",
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  border: "0.9px solid #EFEFF1",
                  overflow: "hidden",
                }}
              >
                <img
                  src={finalProfilePicture}
                  alt="Artist Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Artist Name and Verification */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "54px",
                    fontWeight: 500,
                    color: "#6C6780",
                    fontFamily: "Avenir Next LT Pro",
                  }}
                >
                  {artistName}
                </div>
                {isUserVerified && (
                  <div
                    style={{
                      display: "flex",
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <VerifiedIcon height={48} width={48} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              padding: "32px",
              gap: "40px",
              flex: 1,
              position: "relative",
            }}
          >
            {/* Large Token Logo */}
            <div
              style={{
                display: "flex",
                position: "relative",
                marginTop: "-200px",
              }}
            >
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Token logo */}
                <div
                  style={{
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    border: "4px solid #FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={finalCoinLogo}
                    alt={`${coinName} Logo`}
                    style={{
                      width: "400px",
                      height: "400px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Coin Information */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                width: "490px",
              }}
            >
              {/* Coin Name */}
              <div
                style={{
                  display: "flex",
                  fontSize: "88px",
                  fontWeight: 700,
                  color: "#524F62",
                  fontFamily: "Inter",
                  lineHeight: 1,
                }}
              >
                {coinName}
              </div>

              {/* Coin Ticker - only show if there's a separate name */}
              {coinTicker && (
                <div
                  style={{
                    display: "flex",
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "#736E88",
                    fontFamily: "Inter",
                    lineHeight: 1,
                  }}
                >
                  ${coinTicker}
                </div>
              )}
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

          {/* Border Overlay */}
          {border && (
            <img
              src={border}
              alt="Border"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "1200px",
                height: "630px",
                zIndex: 999,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </BaseLayout>
    );

    return new ImageResponse(renderContent(), {
      width: 1200,
      height: 630,
      fonts: Array.isArray(font) ? [...font] : [font],
    });
  } catch (error: any) {
    console.error("Coin OG Image generation error:", error);
    return c.json({ error: "Failed to generate coin image", details: error.message }, 500);
  }
});

export default coinRoute;
