/**
 * Sanitizes text to prevent OpenType signature errors while preserving emojis.
 * Converts problematic Unicode characters to ASCII equivalents but keeps emojis intact.
 *
 * @param text - The text to sanitize
 * @returns Sanitized text with emojis preserved
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  try {
    // For now, let's just preserve emojis and clean problematic characters without unidecode
    const emojiRanges = [
      [0x1f600, 0x1f64f], // emoticons
      [0x1f300, 0x1f5ff], // misc symbols and pictographs
      [0x1f680, 0x1f6ff], // transport and map symbols
      [0x1f1e0, 0x1f1ff], // regional indicator symbols
      [0x2600, 0x26ff], // misc symbols
      [0x2700, 0x27bf], // dingbats
      [0xfe00, 0xfe0f], // variation selectors
      [0x1f900, 0x1f9ff], // supplemental symbols and pictographs
      [0x1f018, 0x1f270], // enclosed alphanumeric supplement
      [0x238c, 0x2454], // technical symbols
      [0x20d0, 0x20ff], // combining diacritical marks for symbols
    ];

    const specialEmojis = [
      0x1f004, // mahjong tile red dragon
      0x3030, // wavy dash
      0x27b0, // curly loop
      0x27bf, // double curly loop
      0x303d, // part alternation mark
      0x00a9, // copyright sign
      0x00ae, // registered sign
      0x2122, // trade mark sign
      0x2660, // black spade suit
      0x2663, // black club suit
      0x2665, // black heart suit
      0x2666, // black diamond suit
    ];

    // Simple approach: just filter characters
    const result = text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);

        // Check if it's a high surrogate (first part of emoji)
        const isHighSurrogate = code >= 0xd800 && code <= 0xdbff;
        const isLowSurrogate = code >= 0xdc00 && code <= 0xdfff;

        // Keep printable ASCII characters (32-126)
        if (code >= 32 && code <= 126) {
          return char;
        }

        // Keep emoji characters
        if (isHighSurrogate || isLowSurrogate) {
          return char;
        }

        // Check single character emojis
        const isEmoji =
          emojiRanges.some(([start, end]) => code >= start && code <= end) || specialEmojis.includes(code);

        if (isEmoji) {
          return char;
        }

        // Remove problematic characters
        return "";
      })
      .join("")
      .trim();

    return result;
  } catch (error) {
    // Fallback for Cloudflare Workers
    console.warn("sanitization failed, using fallback:", error);
    return text;
  }
}
