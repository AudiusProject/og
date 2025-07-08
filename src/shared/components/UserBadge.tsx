import { BadgeTier } from "../utils/badge";

interface UserBadgeProps {
  isVerified: boolean;
  tier: BadgeTier;
  size?: number;
  verifiedIcon?: string;
  verifiedIconWhite?: string;
  tierIcon?: string;
}

export const UserBadge = ({
  isVerified,
  tier,
  size = 32,
  verifiedIcon,
  verifiedIconWhite,
  tierIcon,
}: UserBadgeProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {isVerified && (verifiedIcon || verifiedIconWhite) && (
        <img
          src={verifiedIcon || verifiedIconWhite || ""}
          alt="Verified"
          height={size}
          width={size}
          style={{ width: `${size}px`, height: `${size}px`, flexBasis: `${size}px` }}
        />
      )}
      {tier && tierIcon && (
        <img
          src={tierIcon}
          alt={`${tier} Tier`}
          height={size}
          width={size}
          style={{ width: `${size}px`, height: `${size}px`, flexBasis: `${size}px` }}
        />
      )}
    </div>
  );
};
