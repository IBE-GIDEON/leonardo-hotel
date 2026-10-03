"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { LineLink } from "@/components/ui";
import { hotel, nav, whatsappLink } from "@/data/content";
import { ease } from "@/lib/motion";

/**
 * Sits still behind the page (sticky to the bottom) and is uncovered as the last
 * section scrolls away. Because it's always "on screen" behind the content,
 * the wordmark is triggered by nearing the end of the page, not by visibility.
 */
export function Footer() {
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [revealed, setRevealed] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const end = document.documentElement.scrollHeight - window.innerHeight;
    if (!revealed && y > end - window.innerHeight * 0.35) setRevealed(true);
  });

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 2.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer className="sticky bottom-0 z-0 flex min-h-[70svh] flex-col justify-end overflow-hidden bg-ink text-ivory">
      <div className="grid grid-cols-2 gap-10 px-5 pt-24 text-[13px] md:grid-cols-12 md:px-10 md:pt-28">
        <div className="col-span-2 md:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/40">Address</p>
          <p className="mt-4 leading-relaxed text-ivory/75">
            {hotel.address[0]}
            <br />
            {hotel.address[1]}
          </p>
        </div>
        <div className="md:col-span-2 md:col-start-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/40">Explore</p>
          <ul className="mt-4 space-y-2 text-ivory/75">
            {nav.map((l) => (
              <li key={l.href}>
                <LineLink href={l.href}>{l.label}</LineLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/40">Contact</p>
          <ul className="mt-4 space-y-2 text-ivory/75">
            <li>
              <LineLink href={hotel.phoneHref}>{hotel.phone}</LineLink>
            </li>
            <li>
              <LineLink href={whatsappLink("Hello Leonardo, I'd like to ask about a stay.")} external>
                WhatsApp
              </LineLink>
            </li>
            <li>
              <LineLink href={hotel.mapUrl} external>
                Directions
              </LineLink>
            </li>
          </ul>
        </div>
        <div className="col-span-2 flex md:col-span-2 md:col-start-11 md:justify-end">
          <button
            onClick={toTop}
            className="group flex h-fit items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-ivory/60 transition-colors hover:text-ivory"
          >
            Back to top
            <span className="grid size-9 place-items-center rounded-full ring-1 ring-ivory/20 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
                <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="mt-16 flex justify-center overflow-hidden px-2 md:mt-20" aria-hidden>
        {"Leonardo".split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block font-serif text-[min(26vw,40svh)] leading-[0.78] tracking-[-0.04em] text-ivory/[0.92]"
            initial={{ y: "100%", filter: "blur(10px)" }}
            animate={revealed ? { y: "0%", filter: "blur(0px)" } : undefined}
            transition={{ duration: 1.4, ease, delay: i * 0.05 }}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      <div className="flex flex-col justify-between gap-2 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-[11px] uppercase tracking-[0.2em] text-ivory/40 md:flex-row md:px-10">
        <span>© {new Date().getFullYear()} {hotel.fullName}</span>
        <span>Port Harcourt, Nigeria</span>
      </div>
    </footer>
  );
}
