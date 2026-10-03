"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { BookingProvider } from "./Booking";

type Intro = { ready: boolean; setReady: (v: boolean) => void };

const IntroContext = createContext<Intro>({ ready: false, setReady: () => {} });

/** `ready` flips to true once the preloader starts lifting, so the hero can animate in underneath it. */
export const useIntro = () => useContext(IntroContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <IntroContext.Provider value={{ ready, setReady }}>
      <MotionConfig reducedMotion="user">
        {reduced ? (
          <BookingProvider>{children}</BookingProvider>
        ) : (
          <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: 0 } }}>
            <BookingProvider>{children}</BookingProvider>
          </ReactLenis>
        )}
      </MotionConfig>
    </IntroContext.Provider>
  );
}
