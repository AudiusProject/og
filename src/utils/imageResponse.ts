import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";

/**
 * Creates an ImageResponse with Discord-friendly headers
 * Discord requires specific headers for proper OG image unfurling
 */
export function createDiscordFriendlyImageResponse(
  element: JSX.Element,
  options: ConstructorParameters<typeof ImageResponse>[1],
) {
  const response = new ImageResponse(element, options);

  // Set explicit headers that Discord expects
  response.headers.set("Content-Type", "image/png");
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  // Add CORS headers for Discord's prefetch
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

  return response;
}
