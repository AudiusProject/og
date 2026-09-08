import { Hono } from "hono";
import { BaseLayout } from "../components/BaseLayout";
import { AudiusLogoHorizontal } from "../components/AudiusLogoHorizontal";
import { PlayButton } from "../components/PlayButton";
import { ContentTag } from "../components/ContentTag";
import { Title } from "../components/Title";
import { UserName } from "../components/UserName";
import { ArtworkCollage } from "../components/ArtworkCollage";
import { getBadgeTier } from "../utils/badge";
import { getLocalFonts } from "../utils/getFonts";
import { APIService } from "../api";
import { getDominantColor } from "../utils/getDominantColor";
import { loadImage } from "../utils/loadImage";
import { getImageUrlWithFallback } from "../utils/fetchImageWithFallback";
import { createDiscordFriendlyImageResponse } from "../utils/imageResponse";
import type { SquareImage, UserData } from "../types";

// How many of the mix's tracks make up the collage.
const COLLAGE_SIZE = 4;

// Must match the limit the apps request, so this hits the same server-side
// cache entry (the API keys its cache on the limit) instead of forcing a
// second run of the ranking query.
const MIX_LIMIT = 30;

// The mix rolls over on Wednesday 00:00 UTC. The web app also stamps the
// period into the image URL as a query param, so scrapers that cache by URL
// pick up the new week; this header covers everything in between.
const ROLLOVER_WEEKDAY_UTC = 3; // Sunday = 0

interface WeeklyRotationTrack {
  id: string;
  artwork?: SquareImage;
}

interface UserByHandleResponse {
  data?: UserData | UserData[];
}

interface WeeklyRotationResponse {
  data?: WeeklyRotationTrack[];
}

function secondsUntilNextRollover(now: Date): number {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let daysAhead = (ROLLOVER_WEEKDAY_UTC - next.getUTCDay() + 7) % 7;
  if (daysAhead === 0) daysAhead = 7;
  next.setUTCDate(next.getUTCDate() + daysAhead);
  return Math.max(60, Math.floor((next.getTime() - now.getTime()) / 1000));
}

/**
 * OG card for a user's Weekly Rotation: a 2x2 collage of the first four
 * tracks' artwork, tinted by the top track, with the listener's name.
 *
 * Keyed by handle rather than user id because that's what the shareable
 * URL carries (`/explore/weekly-rotation/:handle`).
 */
export const weeklyRotationRoute = new Hono().get("/:handle", async (c) => {
  try {
    const handle = c.req.param("handle");
    if (!handle) return c.json({ error: "Missing handle" }, 400);

    const apiService = new APIService(c);

    const userResponse: UserByHandleResponse = await apiService.fetch(
      `/v1/full/users/handle/${encodeURIComponent(handle)}`,
    );
    const user = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
    if (!user?.id) return c.json({ error: "User not found" }, 404);

    const mixResponse: WeeklyRotationResponse = await apiService.fetch(
      `/v1/users/${user.id}/weekly-rotation?limit=${MIX_LIMIT}`,
    );
    const tracks = mixResponse.data ?? [];

    // Resolve the collage artwork in parallel; each one independently falls
    // back through the track's mirrors.
    const artworkUrls = await Promise.all(
      tracks.slice(0, COLLAGE_SIZE).map((track) => getImageUrlWithFallback(track.artwork, "480x480")),
    );
    const resolvedArtwork = artworkUrls.filter((url): url is string => !!url);

    const dominantColor = resolvedArtwork[0]
      ? await getDominantColor(resolvedArtwork[0], tracks[0]?.artwork?.mirrors)
      : undefined;

    const blankArtwork = (await loadImage(c, "/images/blank-artwork.png"))!;

    const userName = user.name;
    const isVerified = user.is_verified;
    const tier = getBadgeTier(user.total_audio_balance);

    const font = await getLocalFonts(c, [
      { path: "Inter-Bold.ttf", weight: 700 },
      { path: "Inter-Regular.ttf", weight: 500 },
      { path: "Inter-Light.ttf", weight: 300 },
    ]);

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
          <ArtworkCollage srcs={resolvedArtwork} fallback={blankArtwork} dominantColor={dominantColor} />

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
              <ContentTag text="mix" color={dominantColor} shadow />
              <AudiusLogoHorizontal height={40} shadow />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "490px",
                marginBottom: "56px",
              }}
            >
              <Title shadow>Weekly Rotation</Title>
              <UserName name={userName} shadow isVerified={isVerified} tier={tier} backgroundColor={dominantColor} />
            </div>

            <PlayButton size={140} shadow />
          </div>
        </div>
      </BaseLayout>
    );

    const response = createDiscordFriendlyImageResponse(renderContent(), {
      width: 1200,
      height: 630,
      fonts: Array.isArray(font) ? [...font] : [font],
    });
    // Not immutable, unlike the entity cards: the same URL means a new
    // image once the week rolls over.
    response.headers.set("Cache-Control", `public, max-age=${secondsUntilNextRollover(new Date())}`);
    return response;
  } catch (error: any) {
    console.error("Weekly Rotation OG Image generation error:", error);
    return c.json({ error: "Failed to generate weekly rotation image", details: error.message }, 500);
  }
});

export default weeklyRotationRoute;
