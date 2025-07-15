import { sanitizeText } from "../utils/sanitizeText";
import { UserBadge } from "./UserBadge";
import { BadgeTier } from "../utils/badge";

interface UserNameProps {
  name: string;
  shadow?: boolean;
  style?: React.CSSProperties;
  isVerified?: boolean;
  tier?: BadgeTier;
  backgroundColor?: string;
  badgeSize?: number;
  verifiedVariant?: "default" | "white";
  color?: string;
}

export function UserName({
  name,
  shadow = false,
  style = {},
  isVerified = false,
  tier,
  backgroundColor,
  badgeSize = 32,
  verifiedVariant = "white",
  color = "#fff",
}: UserNameProps) {
  const sanitizedName = sanitizeText(name);

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <span
        style={{
          fontWeight: 700,
          fontSize: "32px",
          color: color,
          fontFamily: "Avenir Next LT Pro",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textShadow: shadow ? "0 4px 4px rgba(0, 0, 0, 0.10)" : "none",
          // gap is needed to fix text ellipsis
          gap: "8px",
          ...style,
        }}
      >
        {sanitizedName}
      </span>
      {(isVerified || tier) && (
        <UserBadge
          isVerified={isVerified}
          tier={tier || null}
          size={badgeSize}
          verifiedVariant={verifiedVariant}
          backgroundColor={backgroundColor}
        />
      )}
    </div>
  );
}
