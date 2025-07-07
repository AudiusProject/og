import { BadgeTier } from "../types";
import { BADGE_TIERS, ICON_PATHS } from "../config/constants";

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
