"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { FINE_POINTER, useMediaQuery } from "@/lib/useMediaQuery";

/**
 * A soft label that follows the mouse over anything marked `data-cursor="…"`.
 * Mouse and trackpad only; touch screens never see it, and the normal cursor is left alone.
 */
export function Cursor() {
  const enabled = useMediaQuery(FINE_POINTER);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 380, damping: 34, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  // Keep the last text on screen while the bubble shrinks away.
  const [text, setText] = useState("");
  useEffect(() => {
    if (label) setText(label);
  }, [label]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(el ? el.getAttribute("data-cursor") : null);
    };
    const leave = () => setLabel(null);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[75] -ml-11 -mt-11 grid size-22 place-items-center rounded-full bg-ivory/85 text-[11px] font-medium uppercase tracking-[0.2em] text-ink backdrop-blur-md"
      style={{ x: sx, y: sy }}
      initial={false}
      animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0, filter: label ? "blur(0px)" : "blur(6px)" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.div>
  );
}
