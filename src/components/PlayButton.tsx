import React from "react";

interface PlayButtonProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  shadow?: boolean;
}

export const PlayButton = ({ size = 140, shadow = false, ...props }: PlayButtonProps) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: shadow ? "-16px" : "0px",
      marginTop: shadow ? "-16px" : "0px",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={shadow ? size + 16 : size}
      height={shadow ? size + 16 : size}
      viewBox={shadow ? "-8 -8 156 156" : "0 0 140 140"}
      fill="none"
      style={{
        filter: shadow ? "drop-shadow(0 4px 4px #00000019)" : "none",
      }}
      {...props}
    >
      <g clipPath="url(#clip0_188_519)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M70 0C108.66 0 140 31.3401 140 70C140 108.66 108.66 140 70 140C31.3401 140 0 108.66 0 70C0 31.3401 31.3401 0 70 0ZM56.875 43.1249C54.4588 43.1249 52.5 45.0837 52.5 47.4999V92.4992C52.5 93.1916 52.6643 93.8741 52.9795 94.4906C54.0793 96.642 56.7149 97.4945 58.8664 96.3947L102.88 73.8951C103.699 73.4764 104.365 72.8102 104.784 71.991C105.884 69.8396 105.031 67.2039 102.88 66.1041L58.8664 43.6044C58.2499 43.2893 57.5674 43.1249 56.875 43.1249Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_188_519">
          <rect width="140" height="140" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
);
