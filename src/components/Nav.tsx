"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { hotel, nav } from "@/data/content";
import { ease, easeInOut } from "@/lib/motion";
import { useBooking } from "./Booking";
import { useIntro } from "./Providers";
import { LineLink, PillButton } from "./ui";

export function Nav() {
  const { ready } = useIntro();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const booking = useBooking();

  // Highlight whichever section is crossing the middle of the screen.
  useEffect(() => {
    const els = nav.map((l) => document.querySelector(l.href)).filter((e): e is Element => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
          else setActive((a) => (a === `#${e.target.id}` ? null : a));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setSolid(y > window.innerHeight * 0.8);
  });

  // Only touch Lenis once the menu has been used, so we don't fight the preloader's scroll lock.
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (open) setTouched(true);
    if (!open && !touched) return;
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, touched, lenis]);

  const onDark = !solid && !open;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
        initial={{ y: "-120%" }}
        animate={{ y: ready && (!hidden || open) ? "0%" : "-120%" }}
        transition={{ duration: 1, ease, delay: ready && !solid ? 0.9 : 0 }}
      >
        <div
          className={`mx-auto flex h-14 items-center justify-between rounded-full pl-5 pr-2 transition-[background-color,color,box-shadow,backdrop-filter] duration-700 md:h-16 md:pl-7 ${
            open
              ? "text-ivory"
              : solid
                ? "bg-ivory/70 text-ink shadow-[0_1px_0_0_rgba(20,17,14,0.06),0_20px_40px_-24px_rgba(20,17,14,0.35)] backdrop-blur-xl backdrop-saturate-150"
                : "text-ivory"
          }`}
        >
          <a href="#top" className="flex flex-col leading-none" aria-label={hotel.fullName}>
            <span className="font-serif text-[26px] tracking-[-0.01em]">Leonardo</span>
            <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.34em] opacity-60">Spa Hotel &amp; Suites</span>
          </a>

          <nav className="hidden items-center gap-9 text-[13px] md:flex">
            {nav.map((l) => (
              <span key={l.href} className="relative flex items-center">
                <AnimatePresence>
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -left-3 size-1 rounded-full bg-current"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.5, ease }}
                    />
                  )}
                </AnimatePresence>
                <LineLink href={l.href}>{l.label}</LineLink>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <PillButton
              onClick={() => {
                setOpen(false);
                booking.open();
              }}
              tone={onDark ? "glass" : open ? "light" : "dark"}
              className="h-10 gap-3 pl-4 md:h-12 md:gap-5 md:pl-6 [&>span:last-child]:size-7 md:[&>span:last-child]:size-8"
            >
              Reserve
            </PillButton>
            <button
              onClick={() => setOpen((o) => !o)}
              className={`grid size-10 place-items-center rounded-full md:hidden ${onDark ? "bg-white/10 backdrop-blur-md" : open ? "bg-white/10" : "bg-ink/5"}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="relative block h-2.5 w-4">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-[5px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/85 px-5 pb-8 pt-28 text-ivory backdrop-blur-2xl md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.9, ease: easeInOut }}
          >
            <ul className="space-y-1">
              {nav.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block font-serif text-[15vw] leading-[1.05]"
                    initial={{ y: "100%", filter: "blur(8px)" }}
                    animate={{ y: "0%", filter: "blur(0px)" }}
                    exit={{ y: "100%", filter: "blur(8px)" }}
                    transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.07 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <div className="text-sm text-ivory/60">
                <p>{hotel.address[0]}</p>
                <p>{hotel.phone}</p>
              </div>
              <PillButton
                onClick={() => {
                  setOpen(false);
                  booking.open();
                }}
                tone="light"
                className="w-full"
              >
                Reserve your stay
              </PillButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
