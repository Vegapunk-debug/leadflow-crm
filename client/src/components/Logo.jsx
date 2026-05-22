import React from 'react';

export default function Logo({ size = 40, className = '' }) {
  return (
    <svg
      className={`brand-logo ${className}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="LeadFlow"
    >
      <rect x="0" y="0" width="40" height="40" rx="9" fill="#047a55" />
      <text
        x="20"
        y="30"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="'Fraunces', Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="28"
        style={{
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
          letterSpacing: '-0.02em',
        }}
      >
        L
      </text>
    </svg>
  );
}
