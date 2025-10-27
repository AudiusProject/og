export function DogEar() {
  const size = 60;
  const borderRadius = 20;

  // Coin gradient colors
  const gradientColors = {
    color1: "#CC0FE0",
    color2: "#7E1BCC",
    color3: "#1BA1F1",
  };

  // Icon dimensions as percentage of size
  const iconSize = size * 0.33;
  const iconOffset = size * 0.0833;

  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        overflow: "hidden",
        borderTopLeftRadius: `${borderRadius}px`,
        zIndex: 10,
      }}
    >
      {/* Main dog ear triangle with gradient */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <linearGradient id="coinGradient" gradientTransform="rotate(-5)">
            <stop offset="-4.82%" stopColor={gradientColors.color1} />
            <stop offset="49.8%" stopColor={gradientColors.color2} />
            <stop offset="104.43%" stopColor={gradientColors.color3} />
          </linearGradient>
        </defs>
        {/* Dog ear triangle shape */}
        <path
          d={`M0 ${borderRadius}C0 ${borderRadius * 0.448} ${borderRadius * 0.448} 0 ${borderRadius} 0H${size * 0.833}L0 ${size * 0.833}V${borderRadius}Z`}
          fill="url(#coinGradient)"
        />
      </svg>
      {/* Artist Coin icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: `${iconOffset}px`,
          left: `${iconOffset}px`,
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.2002 1.79942C11.0636 1.65019 12.9364 1.65019 14.7998 1.79942L15.4004 1.84727C16.1401 1.90625 16.8573 2.12956 17.5 2.49961C18.1427 2.86967 18.695 3.37748 19.1162 3.98692L19.458 4.47813C20.5186 6.0134 21.4551 7.63034 22.2578 9.31407L22.5166 9.8541C22.835 10.5225 23 11.2537 23 11.9938C23 12.7338 22.835 13.465 22.5166 14.1334L22.2578 14.6754C21.455 16.3591 20.5186 17.9761 19.458 19.5113L19.1162 20.0064C18.6957 20.6171 18.1438 21.1264 17.501 21.4977C16.8583 21.8689 16.1406 22.0922 15.4004 22.152L14.7998 22.2008C12.9364 22.35 11.0636 22.35 9.2002 22.2008L8.59961 22.152C7.85989 22.093 7.14269 21.8706 6.5 21.5006C5.85733 21.1306 5.30494 20.6227 4.88379 20.0133L4.54199 19.5182C3.48137 17.9829 2.54497 16.3651 1.74219 14.6813L1.4834 14.1393C1.165 13.4708 1 12.7396 1 11.9996C1.00006 11.2598 1.1651 10.5292 1.4834 9.86094L1.74219 9.31895C2.54497 7.63513 3.48137 6.01738 4.54199 4.48203L4.88379 3.98692C5.30495 3.37749 5.85731 2.86967 6.5 2.49961C7.14271 2.12956 7.85986 1.90625 8.59961 1.84727L9.2002 1.79942ZM13.7559 5.60313C12.5872 5.50955 11.4127 5.50955 10.2441 5.60313L9.86816 5.6334C9.40419 5.67038 8.95389 5.81048 8.55078 6.04258C8.14776 6.27466 7.80122 6.59302 7.53711 6.9752L7.32324 7.28575C6.6581 8.24859 6.07084 9.263 5.56738 10.3189L5.40527 10.6588C5.20553 11.078 5.10158 11.5364 5.10156 12.0006C5.10156 12.4648 5.20551 12.9231 5.40527 13.3424L5.56738 13.6822C6.07085 14.7383 6.65807 15.7526 7.32324 16.7154L7.53711 17.026C7.80125 17.4082 8.14768 17.7275 8.55078 17.9596C8.95385 18.1916 9.40426 18.3308 9.86816 18.3678L10.2441 18.3981C11.4127 18.4916 12.5872 18.4916 13.7559 18.3981L14.1328 18.3678C14.597 18.3303 15.0472 18.1904 15.4502 17.9576C15.8533 17.7248 16.1992 17.405 16.4629 17.0221L16.6777 16.7115C17.3429 15.7487 17.9301 14.7343 18.4336 13.6783L18.5957 13.3385C18.7954 12.9192 18.8984 12.4608 18.8984 11.9967C18.8984 11.5326 18.7954 11.0741 18.5957 10.6549L18.4336 10.316C17.9301 9.26005 17.3429 8.24568 16.6777 7.28282L16.4629 6.9752C16.1988 6.59307 15.8522 6.27462 15.4492 6.04258C15.0462 5.81058 14.5966 5.67039 14.1328 5.6334L13.7559 5.60313Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
