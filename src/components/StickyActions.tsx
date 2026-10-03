"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { formatNaira, rooms, whatsappLink } from "@/data/content";
import { ease } from "@/lib/motion";
import { useBooking } from "./Booking";
import { WhatsAppIcon } from "./ui";

const hello = "Hello Leonardo, I'd like to ask about a stay.";

/**
 * Appears once the hero is behind you and steps aside near the footer (which has its own CTAs).
 * Phone: a floating booking bar. Tablet and up: a WhatsApp bubble.
 */
export function StickyActions() {
  const { scrollY } = useScroll();
  const { open, isOpen } = useBooking();
  const [show, setShow] = useState(false);
  const from = Math.min(...rooms.map((r) => r.price));

  useMotionValueEvent(scrollY, "change", (y) => {
    const end = document.documentElement.scrollHeight - window.innerHeight;
    setShow(y > window.innerHeight * 0.9 && y < end - window.innerHeight * 0.9);
  });

  const visible = show && !isOpen;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="bar"
            className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 md:hidden"
            initial={{ y: "140%", filter: "blur(8px)" }}
            animate={{ y: 0, filter: "blur(0px)" }}
            exit={{ y: "140%", filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center gap-2 rounded-full bg-ink/80 p-1.5 pl-5 text-ivory shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10 backdrop-blur-xl">
              <div className="mr-auto leading-tight">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">From</p>
                <p className="font-serif text-lg">
                  {formatNaira(from)}
                  <span className="ml-1 font-sans text-[11px] text-ivory/50">/ night</span>
                </p>
              </div>
              <a
                href={whatsappLink(hello)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="grid size-11 place-items-center rounded-full bg-white/10"
              >
                <WhatsAppIcon className="size-5" />
              </a>
              <button
                onClick={() => open()}
                className="h-11 rounded-full bg-ivory px-5 text-[13px] font-medium text-ink"
              >
                Book a room
              </button>
            </div>
          </motion.div>

          <motion.a
            key="wa"
            href={whatsappLink(hello)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-0 overflow-hidden rounded-full bg-ink/85 pl-[18px] pr-[18px] text-ivory shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/10 backdrop-blur-xl transition-[gap,padding] duration-700 ease-out-expo hover:gap-3 hover:pr-6 md:flex"
            initial={{ scale: 0.6, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.6, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease }}
          >
            <WhatsAppIcon className="size-5 shrink-0" />
            <span className="max-w-0 whitespace-nowrap text-[13px] font-medium opacity-0 transition-all duration-700 ease-out-expo group-hover:max-w-40 group-hover:opacity-100">
              Chat with us
            </span>
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}
