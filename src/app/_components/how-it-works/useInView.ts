"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sets `hasEntered` to true the first time the observed element crosses the
 * threshold. Never flips back to false — animations only need a one-way signal.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.25 }
) {
  const ref = useRef<T | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasEntered) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
          return;
        }
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, hasEntered };
}
