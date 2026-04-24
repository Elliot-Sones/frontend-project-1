import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NotificationCard } from "./components/NotificationCard";
import { NOTIFICATIONS } from "./notifications";

export function HeroComposition() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "visible" }}>
      {NOTIFICATIONS.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          frame={frame}
        />
      ))}
    </AbsoluteFill>
  );
}
