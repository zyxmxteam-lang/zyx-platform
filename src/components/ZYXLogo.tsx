"use client";

export default function ZYXLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Triangle Z-shape: left pointing up */}
      <polygon
        points="5,80 30,20 55,80"
        stroke="white"
        strokeWidth="3.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Inner base line */}
      <line x1="5" y1="80" x2="55" y2="80" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Triangle Y-shape: center */}
      <polygon
        points="30,80 55,20 80,80"
        stroke="white"
        strokeWidth="3.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Small bottom triangle accent */}
      <polygon
        points="38,80 55,52 72,80"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ZYXLogoFull({ size = 36 }: { size?: number }) {
  return (
    <span
      style={{
        fontSize: size * 0.65,
        fontWeight: 800,
        letterSpacing: "0.18em",
        color: "white",
        fontFamily: "inherit",
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      ZYX
    </span>
  );
}
