/**
 * Fetches an image with mirror fallback support.
 * If the primary URL fails, it will attempt to fetch from mirror content nodes.
 *
 * This is similar to the useImageSize hook in the web-app but adapted for server-side usage.
 *
 * @param url - The primary URL to fetch
 * @param mirrors - Array of mirror hostnames to try if primary fails
 * @returns The working URL or the original URL if all attempts fail
 */
export async function fetchImageWithFallback(url: string | undefined, mirrors?: string[]): Promise<string | undefined> {
  if (!url) return undefined;

  // Try the primary URL first
  const urlsToTry: string[] = [url];

  // Add mirror URLs if available
  if (mirrors && mirrors.length > 0) {
    for (const mirror of mirrors) {
      try {
        const originalUrl = new URL(url);
        const mirrorUrl = new URL(mirror);
        originalUrl.hostname = mirrorUrl.hostname;
        urlsToTry.push(originalUrl.toString());
      } catch (e) {
        console.warn(`Failed to construct mirror URL from ${mirror}:`, e);
      }
    }
  }

  // Try each URL in sequence
  for (const tryUrl of urlsToTry) {
    try {
      const response = await fetch(tryUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      if (response.ok) {
        return tryUrl;
      }
    } catch (e) {
      // Continue to next URL
      continue;
    }
  }

  // If all attempts fail, return the original URL
  // The browser/renderer will handle the final failure
  console.warn(`All mirror attempts failed for ${url}, using original URL`);
  return url;
}

/**
 * Helper to get the best available URL from an image object with a specific size.
 * Automatically tries mirror fallback if available.
 *
 * @param image - The image object (e.g., profile_picture, cover_photo, artwork)
 * @param size - The desired size key (e.g., "480x480", "2000x")
 * @returns The best available URL or undefined
 */
export async function getImageUrlWithFallback(
  image: { [key: string]: any; mirrors?: string[] } | undefined,
  size: string,
): Promise<string | undefined> {
  if (!image) return undefined;

  const url = image[size] as string | undefined;
  const mirrors = image.mirrors;

  return fetchImageWithFallback(url, mirrors);
}
