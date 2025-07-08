// Badge-related types and constants
export type BadgeTier = "Bronze" | "Silver" | "Gold" | "Platinum" | null;

const BADGE_TIERS = {
  PLATINUM: { min: 10000, name: "Platinum" },
  GOLD: { min: 1000, name: "Gold" },
  SILVER: { min: 100, name: "Silver" },
  BRONZE: { min: 10, name: "Bronze" },
} as const;

const ICON_PATHS = {
  TOKEN_BRONZE: "/icons/TokenBronze.svg",
  TOKEN_SILVER: "/icons/TokenSilver.svg",
  TOKEN_GOLD: "/icons/TokenGold.svg",
  TOKEN_PLATINUM: "/icons/TokenPlatinum.svg",
} as const;

export const getBadgeTier = (balance: number): BadgeTier => {
  if (balance >= BADGE_TIERS.PLATINUM.min) {
    return BADGE_TIERS.PLATINUM.name;
  } else if (balance >= BADGE_TIERS.GOLD.min) {
    return BADGE_TIERS.GOLD.name;
  } else if (balance >= BADGE_TIERS.SILVER.min) {
    return BADGE_TIERS.SILVER.name;
  } else if (balance >= BADGE_TIERS.BRONZE.min) {
    return BADGE_TIERS.BRONZE.name;
  }
  return null;
};

export const getBadgeIconPath = (tier: BadgeTier): string | null => {
  if (!tier) return null;

  switch (tier) {
    case "Platinum":
      return ICON_PATHS.TOKEN_PLATINUM;
    case "Gold":
      return ICON_PATHS.TOKEN_GOLD;
    case "Silver":
      return ICON_PATHS.TOKEN_SILVER;
    case "Bronze":
      return ICON_PATHS.TOKEN_BRONZE;
    default:
      return null;
  }
};
