import React from "react";
import { TokenBronze } from "./TokenBronze";
import { TokenSilver } from "./TokenSilver";
import { TokenGold } from "./TokenGold";
import { TokenPlatinum } from "./TokenPlatinum";
import { BadgeTier } from "../utils/badge";

interface ArtistTierIconProps extends React.SVGProps<SVGSVGElement> {
  tier: BadgeTier;
}

export const ArtistTierIcon: React.FC<ArtistTierIconProps> = ({ tier, ...props }) => {
  switch (tier) {
    case "Bronze":
      return <TokenBronze {...props} />;
    case "Silver":
      return <TokenSilver {...props} />;
    case "Gold":
      return <TokenGold {...props} />;
    case "Platinum":
      return <TokenPlatinum {...props} />;
    default:
      return null;
  }
};
