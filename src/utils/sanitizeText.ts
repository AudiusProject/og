import unidecode from "unidecode";

/**
 * Sanitizes text to prevent OpenType signature errors by converting Unicode characters
 * to ASCII equivalents using unidecode, with a fallback for Cloudflare Workers.
 *
 * @param text - The text to sanitize
 * @returns Sanitized text with Unicode characters converted to ASCII
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  try {
    // Use unidecode to convert Unicode to ASCII
    const decoded = unidecode(text);

    // Additional safety: remove any remaining problematic characters
    return decoded
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        // Keep only printable ASCII characters (32-126)
        return code >= 32 && code <= 126 ? char : "";
      })
      .join("")
      .trim();
  } catch (error) {
    // Fallback for Cloudflare Workers if unidecode fails
    console.warn("unidecode failed, using fallback sanitization:", error);

    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        // Keep only printable ASCII characters (32-126)
        return code >= 32 && code <= 126 ? char : "";
      })
      .join("")
      .trim();
  }
}
