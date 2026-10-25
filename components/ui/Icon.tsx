import type { SVGProps } from "react";

// Stroke icons from the WashOn design canvas. Decorative by default
// (aria-hidden); give the surrounding button or link the accessible name.
const ICONS = {
  "arrow-right": { viewBox: "0 0 16 16", body: <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  bell: { viewBox: "0 0 16 16", body: <path d="M8 1.8a4.2 4.2 0 0 0-4.2 4.2v2.6L2.6 11h10.8l-1.2-2.4V6A4.2 4.2 0 0 0 8 1.8zM6.3 13a1.8 1.8 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" /> },
  check: { viewBox: "0 0 16 16", body: <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  "chevron-down": { viewBox: "0 0 16 16", body: <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  clock: {
    viewBox: "0 0 16 16",
    body: (
      <>
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 4.8V8l2.2 1.4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  user: {
    viewBox: "0 0 16 16",
    body: (
      <>
        <circle cx="8" cy="5.5" r="2.7" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M2.8 14c.6-2.6 2.7-4.2 5.2-4.2s4.6 1.6 5.2 4.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  grid: {
    viewBox: "0 0 20 20",
    body: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  "grid-solid": {
    viewBox: "0 0 20 20",
    body: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
      </>
    ),
  },
  "grid-accent": {
    viewBox: "0 0 20 20",
    body: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
      </>
    ),
  },
  "clock-lg": {
    viewBox: "0 0 20 20",
    body: (
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M10 6v4l2.8 1.8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  flag: { viewBox: "0 0 20 20", body: <path d="M5 17.5V3M5 3.5h9.5l-2 3.8 2 3.7H5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  pin: {
    viewBox: "0 0 20 20",
    body: (
      <>
        <path d="M10 18s-5.5-5-5.5-9.2a5.5 5.5 0 0 1 11 0C15.5 13 10 18 10 18z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <circle cx="10" cy="8.6" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  basket: {
    viewBox: "0 0 20 20",
    body: (
      <>
        <rect x="3" y="2" width="14" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M3 6h14" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  "chevron-right": { viewBox: "0 0 16 16", body: <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  "bell-solid": { viewBox: "0 0 16 16", body: <path d="M8 1.8a4.2 4.2 0 0 0-4.2 4.2v2.6L2.6 11h10.8l-1.2-2.4V6A4.2 4.2 0 0 0 8 1.8zM6.3 13a1.8 1.8 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.4" fill="currentColor" strokeLinejoin="round" /> },
  alert: {
    viewBox: "0 0 16 16",
    body: (
      <>
        <path d="M8 4.5v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="8" cy="11.3" r="1.1" fill="currentColor" />
      </>
    ),
  },
  "check-circle": {
    viewBox: "0 0 24 24",
    body: (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path d="M7.5 12.5l3 3 6-6.5" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  "clock-circle": {
    viewBox: "0 0 24 24",
    body: (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path d="M12 7v5.2l3.4 2" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  "check-badge": {
    viewBox: "0 0 14 14",
    body: (
      <>
        <circle cx="7" cy="7" r="7" fill="currentColor" />
        <path d="M4.2 7.1l1.9 1.9 3.7-4" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  "alert-circle": {
    viewBox: "0 0 16 16",
    body: (
      <>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M8 4.8v3.8M8 10.9v.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  "arrow-left": { viewBox: "0 0 16 16", body: <path d="M13 8H3.5M7.5 3.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  "chevron-left": { viewBox: "0 0 16 16", body: <path d="M10 3.5L5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  close: { viewBox: "0 0 16 16", body: <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /> },
  eye: {
    viewBox: "0 0 20 20",
    body: (
      <>
        <path d="M1.8 10S5 4.2 10 4.2 18.2 10 18.2 10 15 15.8 10 15.8 1.8 10 1.8 10z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  "eye-off": {
    viewBox: "0 0 20 20",
    body: (
      <path
        d="M3 3l14 14M8.2 4.4A8.6 8.6 0 0 1 10 4.2C15 4.2 18.2 10 18.2 10a14 14 0 0 1-2.6 3.3M5.2 6.2C3 7.8 1.8 10 1.8 10S5 15.8 10 15.8c1.3 0 2.5-.4 3.5-1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 16, ...rest }: IconProps) {
  const icon = ICONS[name];
  return (
    <svg width={size} height={size} viewBox={icon.viewBox} aria-hidden="true" focusable="false" {...rest}>
      {icon.body}
    </svg>
  );
}
