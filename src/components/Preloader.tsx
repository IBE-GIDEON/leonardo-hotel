"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useIntro } from "./Providers";
import { ease, easeInOut } from "@/lib/motion";

const SEEN_KEY = "leonardo-intro-seen";

export function Preloader() {
  const { setReady } = useIntro();
  const lenis = useLenis();
  const [done, setDone] = useState(false);
  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) => Math.round(v).toString().padStart(3, "0"));
  const bar = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [lenis, done]);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      setReady(true);
      document.documentElement.classList.remove("is-loading");
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    };

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.set(100);
      const t = setTimeout(finish, 250);
      return () => clearTimeout(t);
    }

    const c = animate(progress, 100, { duration: 2.2, ease: easeInOut, onComplete: finish });
    return () => c.stop();
  }, [progress, setReady]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-ink p-5 text-ivory md:p-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.2, ease: easeInOut }}
        >
          <div className="flex justify-between text-[11px] uppercase tracking-[0.22em] text-ivory/50">
            <span>Port Harcourt</span>
            <span>Spa Hotel &amp; Suites</span>
          </div>

          <div className="overflow-hidden text-center">
            <motion.h2
              className="font-serif text-[18vw] leading-[0.9] tracking-[-0.02em] md:text-[11vw]"
              initial={{ y: "100%", filter: "blur(12px)" }}
              animate={{ y: "0%", filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease, delay: 0.1 }}
            >
              Leonardo
            </motion.h2>
          </div>

          <div className="flex items-end justify-between gap-6">
            <motion.div className="h-px flex-1 origin-left bg-ivory/60" style={{ scaleX: bar }} />
            <motion.span className="font-serif text-4xl tabular-nums md:text-5xl">{counter}</motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
