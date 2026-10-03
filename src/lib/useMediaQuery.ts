"use client";

import { useEffect, useState } from "react";

/** SSR-safe media query hook. Returns `fallback` until mounted. */
export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export const DESKTOP = "(min-width: 1024px)";
export const TABLET_UP = "(min-width: 768px)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
