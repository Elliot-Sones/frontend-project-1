import { BEATS } from "./constants";

export type Integration =
  | "datadog"
  | "pagerduty"
  | "slack"
  | "jira"
  | "github"
  | "damasqas";

export interface NotificationPosition {
  /** CSS left value — number = px, string = % */
  left: number | string;
  /** CSS top value */
  top: number | string;
  /** translateZ in px (depth — higher = closer) */
  translateZ: number;
  /** tilt around Y in degrees */
  rotateY: number;
  /** tilt around X in degrees */
  rotateX: number;
  /** in-plane rotation in degrees */
  rotateZ: number;
  /** final card width in px */
  width: number;
  /** target opacity once entered (0–1) */
  opacity: number;
  /** optional blur for deep-back cards */
  blur?: number;
  /** z-index (rendering order) */
  zIndex: number;
}

export interface Notification {
  id: string;
  integration: Integration;
  title: string;
  body?: string;
  time: string;
  enterFrame: number;
  position: NotificationPosition;
  isHero?: boolean;
}

/** 8 notifications in the hero stack, in chronological order of entry. */
export const NOTIFICATIONS: Notification[] = [
  {
    id: "datadog-alert",
    integration: "datadog",
    title: "P1 · checkout 5xx spike",
    body: "error rate <b>47%</b> · auth-svc",
    time: "−42s",
    enterFrame: BEATS.datadogEnter,
    position: {
      left: 290, top: "22%",
      translateZ: 70, rotateY: -10, rotateX: 8, rotateZ: -5,
      width: 370, opacity: 0.95, zIndex: 15,
    },
  },
  {
    id: "pagerduty-ack",
    integration: "pagerduty",
    title: "Incident #4821 ack'd",
    body: "by <b>damasqas</b> · no page sent",
    time: "−41s",
    enterFrame: BEATS.pagerdutyEnter,
    position: {
      left: 520, top: "80%",
      translateZ: -20, rotateY: -12, rotateX: -6, rotateZ: -4,
      width: 260, opacity: 0.82, zIndex: 8,
    },
  },
  {
    id: "slack-thread",
    integration: "slack",
    title: "#ops-alerts thread opened",
    body: "context shared, watchers added",
    time: "−39s",
    enterFrame: BEATS.slackEnter,
    position: {
      left: 550, top: "14%",
      translateZ: -30, rotateY: -14, rotateX: 8, rotateZ: 3,
      width: 240, opacity: 0.8, zIndex: 7,
    },
  },
  {
    id: "jira-ticket",
    integration: "jira",
    title: "INC-223 created",
    body: "linked to <code>3f82a</code>",
    time: "−37s",
    enterFrame: BEATS.jiraEnter,
    position: {
      left: 830, top: "34%",
      translateZ: -140, rotateY: -20, rotateX: 4, rotateZ: -4,
      width: 200, opacity: 0.62, blur: 0.7, zIndex: 5,
    },
  },
  {
    id: "damasqas-investigating",
    integration: "damasqas",
    title: "Correlating 12 deploys",
    body: "last 30min · auth, checkout, billing",
    time: "−32s",
    enterFrame: BEATS.investigatingEnter,
    position: {
      left: 420, top: "52%",
      translateZ: 10, rotateY: -14, rotateX: 2, rotateZ: 2,
      width: 310, opacity: 0.88, zIndex: 11,
    },
  },
  {
    id: "github-commit",
    integration: "github",
    title: "Commit <code>3f82a</code> identified",
    body: "<code>checkout.ts:142</code> · empty cart regression",
    time: "−7s",
    enterFrame: BEATS.githubCommitEnter,
    position: {
      left: 200, top: "74%",
      translateZ: 90, rotateY: -8, rotateX: -2, rotateZ: 3,
      width: 370, opacity: 0.97, zIndex: 17,
    },
  },
  {
    id: "github-pr",
    integration: "github",
    title: "Revert PR #481",
    body: "rolling back <code>3f82a</code>",
    time: "−2s",
    enterFrame: BEATS.githubPrEnter,
    position: {
      left: 870, top: "66%",
      translateZ: -220, rotateY: -24, rotateX: -6, rotateZ: 4,
      width: 180, opacity: 0.45, blur: 1.4, zIndex: 3,
    },
  },
  {
    id: "damasqas-resolved",
    integration: "damasqas",
    title: "✓ Resolved in 42s",
    body: "Rolled back <code>3f82a</code>. Error rate <b>0.4%</b>.",
    time: "now",
    enterFrame: BEATS.heroEnter,
    position: {
      left: -180, top: "42%",
      translateZ: 240, rotateY: -5, rotateX: 2, rotateZ: -3,
      width: 500, opacity: 1, zIndex: 20,
    },
    isHero: true,
  },
];
