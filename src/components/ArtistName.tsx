import { sanitizeText } from "../utils/sanitizeText";
import { UserBadge } from "./UserBadge";
import { BadgeTier } from "../utils/badge";

interface ArtistNameProps {
  name: string;
  shadow?: boolean;
  style?: React.CSSProperties;
  isVerified?: boolean;
  tier?: BadgeTier;
  backgroundColor?: string;
}

export function ArtistName({
  name,
  shadow = false,
  style = {},
  isVerified = false,
  tier,
  backgroundColor,
}: ArtistNameProps) {
  const sanitizedName = sanitizeText(name);

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <span
        style={{
          gap: "8px",
          fontWeight: 700,
          fontSize: "32px",
          color: "#fff",
          fontFamily: "Avenir Next LT Pro",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textShadow: shadow ? "0 4px 4px rgba(0, 0, 0, 0.10)" : "none",
          ...style,
        }}
      >
        {sanitizedName}
      </span>
      {(isVerified || tier) && (
        <UserBadge
          isVerified={isVerified}
          tier={tier || null}
          size={32}
          verifiedVariant="white"
          backgroundColor={backgroundColor}
        />
      )}
    </div>
  );
}
