export const OG_IMAGE_CONFIG = {
  width: 1200,
  height: 630,
} as const;

export const FONT_CONFIG = {
  bold: { path: "Inter-Bold.ttf", weight: 700 },
  regular: { path: "Inter-Regular.ttf", weight: 500 },
  light: { path: "Inter-Light.ttf", weight: 300 },
} as const;

export const BADGE_TIERS = {
  PLATINUM: { min: 10000, name: "Platinum" },
  GOLD: { min: 1000, name: "Gold" },
  SILVER: { min: 100, name: "Silver" },
  BRONZE: { min: 10, name: "Bronze" },
} as const;

export const ICON_PATHS = {
  AUDIUS_LOGO: "/icons/AudiusLogoHorizontal.svg",
  VERIFIED: "/icons/Verified.svg",
  VERIFIED_WHITE: "/icons/VerifiedWhite.svg",
  TOKEN_BRONZE: "/icons/TokenBronze.svg",
  TOKEN_SILVER: "/icons/TokenSilver.svg",
  TOKEN_GOLD: "/icons/TokenGold.svg",
  TOKEN_PLATINUM: "/icons/TokenPlatinum.svg",
} as const;

export const IMAGE_PATHS = {
  AIRDROP_BACKGROUND: "/images/airdrop.png",
} as const;

export const STYLES = {
  GRADIENT_BACKGROUND: "linear-gradient(-22deg, #5b23e1 0%, #a22feb 100%)",
  TEXT_FADE_GRADIENT:
    "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, 1) 100%)",
} as const;

export const COLORS = {
  WHITE: "#FFF",
  TEXT_PRIMARY: "#524F62",
} as const;
