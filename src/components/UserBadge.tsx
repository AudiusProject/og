import { BadgeTier } from "../utils/badge";
import React from "react";
import { ArtistTierIcon } from "./ArtistTierIcon";
import { VerifiedIcon } from "./VerifiedIcon";

interface UserBadgeProps {
  isVerified: boolean;
  tier: BadgeTier;
  size?: number;
  verifiedVariant?: "default" | "white";
}

export const UserBadge = ({ isVerified, tier, size = 32, verifiedVariant = "white" }: UserBadgeProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {isVerified && <VerifiedIcon variant={verifiedVariant} height={size} width={size} />}
      {tier && <ArtistTierIcon tier={tier} height={size} width={size} />}
    </div>
  );
};
