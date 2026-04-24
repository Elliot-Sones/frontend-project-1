import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement>;

export function DatadogLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="14" fill="#632CA6" />
      <path
        d="M10 20 L18 10 L18 18 L22 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="22" cy="14" r="1.5" fill="white" />
    </svg>
  );
}

export function GitHubLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden="true" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.09.81 2.19v3.24c0 .32.22.69.82.58C20.57 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function RailwayLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#0B0D0E" />
      <text
        x="16"
        y="22"
        fontFamily="-apple-system, Helvetica, Arial, sans-serif"
        fontSize="15"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
      >
        R
      </text>
    </svg>
  );
}

export function PagerDutyLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#06AC38" />
      <path d="M10 8 H17 a5 5 0 0 1 0 10 H13 V24 H10 Z" fill="white" />
    </svg>
  );
}
