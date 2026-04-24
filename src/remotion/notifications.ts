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
      left: 240, top: "18%",
      translateZ: 70, rotateY: -10, rotateX: 8, rotateZ: -5,
      width: 410, opacity: 1, zIndex: 15,
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
      left: 470, top: "78%",
      translateZ: -20, rotateY: -12, rotateX: -6, rotateZ: -4,
      width: 310, opacity: 1, zIndex: 8,
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
      left: 500, top: "16%",
      translateZ: -40, rotateY: -14, rotateX: 8, rotateZ: 3,
      width: 300, opacity: 1, zIndex: 7,
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
      left: 700, top: "34%",
      translateZ: -120, rotateY: -20, rotateX: 4, rotateZ: -4,
      width: 280, opacity: 1, zIndex: 5,
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
      left: 370, top: "52%",
      translateZ: 10, rotateY: -14, rotateX: 2, rotateZ: 2,
      width: 340, opacity: 1, zIndex: 11,
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
      left: 170, top: "76%",
      translateZ: 90, rotateY: -8, rotateX: -2, rotateZ: 3,
      width: 410, opacity: 1, zIndex: 17,
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
      left: 730, top: "66%",
      translateZ: -180, rotateY: -24, rotateX: -6, rotateZ: 4,
      width: 260, opacity: 1, zIndex: 3,
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
      left: -200, top: "42%",
      translateZ: 280, rotateY: -5, rotateX: 2, rotateZ: -3,
      width: 580, opacity: 1, zIndex: 20,
    },
    isHero: true,
  },
];
