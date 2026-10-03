"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { featuredRooms, formatNaira, roomMeta, whatsappLink } from "@/data/content";
import { ease, easeInOut } from "@/lib/motion";
import { DESKTOP } from "@/lib/useMediaQuery";
import { useBooking } from "./Booking";
import { CARD_SIZES } from "@/lib/sizes";
import { Arrow, PillButton, WhatsAppIcon } from "./ui";

/**
 * Full-screen room view. The photo flies out of the card it was opened from (a FLIP from `from`),
 * and flies back into it on close, unless the guest has paged to another room, in which case it fades.
 */
export function RoomOverlay({ startIndex, from, onClose }: { startIndex: number; from: DOMRect; onClose: () => void }) {
  const lenis = useLenis();
  const { open: openBooking } = useBooking();
  const [index, setIndex] = useState(startIndex);
  const [dir, setDir] = useState(1);
  const room = featuredRooms[index];
  const moved = index !== startIndex;

  const target = useMemo(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return window.matchMedia(DESKTOP).matches
      ? { top: 12, left: 12, width: w * 0.55 - 18, height: h - 24, borderRadius: 24 }
      : { top: 0, left: 0, width: w, height: Math.round(h * 0.52), borderRadius: 0 };
  }, []);
  const origin = { top: from.top, left: from.left, width: from.width, height: from.height, borderRadius: 6 };

  const go = useCallback((step: number) => {
    setDir(step);
    setIndex((i) => (i + step + featuredRooms.length) % featuredRooms.length);
  }, []);

  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose, go]);

  const reserve = () => {
    onClose();
    setTimeout(() => openBooking(room.slug), 450);
  };

  return createPortal(
    <div className="fixed inset-0 z-[62] text-ivory" role="dialog" aria-modal="true" aria-label={room.name}>
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.25 } }}
        transition={{ duration: 0.6 }}
      />

      {/* Photo: flies from the card, then pages between rooms with a blur cross-fade. */}
      <motion.div
        className="absolute overflow-hidden bg-espresso"
        initial={origin}
        animate={target}
        exit={moved ? { opacity: 0, filter: "blur(12px)", transition: { duration: 0.5 } } : origin}
        transition={{ duration: 1.05, ease: easeInOut }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70) go(1);
          else if (info.offset.x > 70) go(-1);
        }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={room.slug}
            className="absolute inset-0"
            custom={dir}
            initial={{ opacity: 0, scale: 1.12, x: `${dir * 8}%`, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, x: "0%", filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.04, x: `${dir * -6}%`, filter: "blur(16px)" }}
            transition={{ duration: 1, ease }}
          >
            {/* The card's copy is already cached, so it shows instantly while the sharp one loads over it. */}
            <Image src={room.image} alt="" fill sizes={CARD_SIZES} className="object-cover" />
            <Image
              src={room.image}
              alt={room.name}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent lg:hidden" />
      </motion.div>

      {/* Details */}
      <motion.div
        className="absolute inset-x-0 bottom-0 top-[52svh] overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7 lg:left-[55%] lg:top-0 lg:flex lg:flex-col lg:justify-center lg:px-[5vw] lg:py-12"
        data-lenis-prevent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.45, duration: 0.6 } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        <AnimatePresence mode="wait" initial={true}>
          <motion.div
            key={room.slug}
            initial="hidden"
            animate="shown"
            exit="gone"
            variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          >
            <Line>
              <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/50">
                Room {String(index + 1).padStart(2, "0")} / {String(featuredRooms.length).padStart(2, "0")}
              </p>
            </Line>
            <Line>
              <h2 className="mt-4 font-serif text-[13vw] leading-[0.92] tracking-[-0.02em] sm:text-6xl lg:text-[clamp(3.5rem,5vw,6rem)]">
                {room.name}
              </h2>
            </Line>
            <Line>
              <p className="mt-4 text-[13px] text-ivory/55">{roomMeta(room)}</p>
            </Line>
            <Line>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ivory/75">{room.note}</p>
            </Line>
            <Line>
              <ul className="mt-8 grid max-w-md grid-cols-2 border-t border-ivory/10">
                {room.features.map((f) => (
                  <li key={f} className="border-b border-ivory/10 py-3 pr-4 text-[13px] text-ivory/80">
                    {f}
                  </li>
                ))}
              </ul>
            </Line>
            <Line>
              <div className="mt-8 flex items-baseline gap-3">
                <span className="font-serif text-4xl">{formatNaira(room.price)}</span>
                <span className="text-[12px] text-ivory/50">per night</span>
              </div>
            </Line>
            <Line>
              <div className="mt-6 flex flex-wrap gap-2">
                <PillButton onClick={reserve} tone="light">
                  Reserve this room
                </PillButton>
                <PillButton
                  href={whatsappLink(`Hello Leonardo, I'm interested in the ${room.name}. Is it available?`)}
                  external
                  tone="glass"
                  icon={<WhatsAppIcon className="size-3.5" />}
                >
                  WhatsApp
                </PillButton>
              </div>
            </Line>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <div className="pointer-events-auto flex gap-2">
          <IconButton label="Previous room" onClick={() => go(-1)}>
            <Arrow className="rotate-180" />
          </IconButton>
          <IconButton label="Next room" onClick={() => go(1)}>
            <Arrow />
          </IconButton>
        </div>
        <div className="pointer-events-auto">
          <IconButton label="Close" onClick={onClose}>
            <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
        shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
        gone: { opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.3 } },
      }}
    >
      {children}
    </motion.div>
  );
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full bg-ink/40 text-ivory ring-1 ring-inset ring-white/15 backdrop-blur-md transition-colors hover:bg-ink/70"
    >
      {children}
    </button>
  );
}
