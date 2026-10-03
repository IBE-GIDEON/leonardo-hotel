"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useLenis } from "lenis/react";
import { formatNaira, hotel, roomMeta, rooms, whatsappLink } from "@/data/content";
import { ease, easeInOut } from "@/lib/motion";
import { TABLET_UP } from "@/lib/useMediaQuery";
import { PillButton, WhatsAppIcon } from "./ui";

type Booking = { open: (roomSlug?: string) => void; close: () => void; isOpen: boolean };

const BookingContext = createContext<Booking>({ open: () => {}, close: () => {}, isOpen: false });

/** Opens the "Plan your stay" panel from anywhere, optionally with a room preselected. */
export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [slug, setSlug] = useState<string>();

  const open = useCallback((roomSlug?: string) => {
    setSlug(roomSlug);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <AnimatePresence>{isOpen && <BookingPanel key="booking" initialSlug={slug} onClose={close} />}</AnimatePresence>
    </BookingContext.Provider>
  );
}

/** Button that opens the booking panel. Safe to drop into server components. */
export function ReserveButton({
  children = "Reserve your stay",
  room,
  tone = "dark",
  className,
}: {
  children?: string;
  room?: string;
  tone?: "dark" | "light" | "glass";
  className?: string;
}) {
  const { open } = useBooking();
  return (
    <PillButton onClick={() => open(room)} tone={tone} className={className}>
      {children}
    </PillButton>
  );
}

// ---- dates -------------------------------------------------------------

const toISO = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const parse = (s: string) => new Date(`${s}T00:00:00`);
const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const nightsBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86_400_000);
const pretty = (s: string) =>
  parse(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// ---- panel -------------------------------------------------------------

function BookingPanel({ initialSlug, onClose }: { initialSlug?: string; onClose: () => void }) {
  const lenis = useLenis();
  const drag = useDragControls();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [side] = useState(() => window.matchMedia(TABLET_UP).matches);

  const today = useMemo(() => toISO(new Date()), []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(() => addDays(today, 1));
  const [guests, setGuests] = useState(2);
  const [slug, setSlug] = useState(initialSlug ?? rooms[0].slug);

  const fits = useCallback((guestCount: number, r: (typeof rooms)[number]) => !r.guests || guestCount <= r.guests, []);
  const room = rooms.find((r) => r.slug === slug) ?? rooms[0];
  const nights = Math.max(1, nightsBetween(checkIn, checkOut));
  const total = room.price * nights;

  const changeGuests = (delta: number) => setGuests((g) => Math.min(8, Math.max(1, g + delta)));

  // If the party outgrows the selected room, move to the first room that fits.
  useEffect(() => {
    const current = rooms.find((r) => r.slug === slug);
    if (current && !fits(guests, current)) {
      const next = rooms.find((r) => fits(guests, r));
      if (next) setSlug(next.slug);
    }
  }, [guests, slug, fits]);

  const changeCheckIn = (v: string) => {
    if (!v) return;
    setCheckIn(v);
    if (nightsBetween(v, checkOut) < 1) setCheckOut(addDays(v, 1));
  };

  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  const message = `Hello Leonardo, I'd like to book the ${room.name} from ${pretty(checkIn)} to ${pretty(checkOut)} (${nights} night${nights > 1 ? "s" : ""}) for ${guests} guest${guests > 1 ? "s" : ""}. Is it available?`;

  return (
    <div className="fixed inset-0 z-[65]">
      <motion.div
        className="absolute inset-0 bg-ink/45 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={onClose}
      />

      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="Plan your stay"
        className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-hidden rounded-t-[28px] bg-ivory text-ink shadow-2xl md:inset-y-3 md:left-auto md:right-3 md:max-h-none md:w-[460px] md:rounded-[28px]"
        initial={side ? { x: "110%" } : { y: "100%" }}
        animate={side ? { x: 0 } : { y: 0 }}
        exit={side ? { x: "110%" } : { y: "100%" }}
        transition={{ duration: 0.85, ease: easeInOut }}
        drag={side ? false : "y"}
        dragListener={false}
        dragControls={drag}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 600) onClose();
        }}
      >
        <div
          className="flex touch-none justify-center pb-1 pt-3 md:hidden"
          onPointerDown={(e) => drag.start(e)}
          aria-hidden
        >
          <span className="h-1 w-10 rounded-full bg-ink/15" />
        </div>

        <header className="flex items-start justify-between px-6 pb-5 pt-3 md:px-8 md:pt-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Reservations</p>
            <h2 className="mt-2 font-serif text-4xl leading-none">Plan your stay</h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full bg-ink/5 transition-colors hover:bg-ink/10"
            aria-label="Close"
          >
            <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 md:px-8">
          <Step delay={0.15}>
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl ring-1 ring-ink/10">
              <DateField label="Check in" value={checkIn} min={today} onChange={changeCheckIn} />
              <DateField
                label="Check out"
                value={checkOut}
                min={addDays(checkIn, 1)}
                onChange={(v) => v && setCheckOut(v)}
                className="border-l border-ink/10"
              />
            </div>
          </Step>

          <Step delay={0.2}>
            <div className="mt-3 flex items-center justify-between rounded-2xl px-4 py-3.5 ring-1 ring-ink/10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Guests</p>
                <p className="mt-1 font-serif text-2xl leading-none">
                  {guests} {guests > 1 ? "guests" : "guest"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Stepper label="Fewer guests" onClick={() => changeGuests(-1)} disabled={guests <= 1}>
                  −
                </Stepper>
                <Stepper label="More guests" onClick={() => changeGuests(1)} disabled={guests >= 8}>
                  +
                </Stepper>
              </div>
            </div>
          </Step>

          <Step delay={0.25}>
            <p className="mb-3 mt-8 text-[11px] uppercase tracking-[0.2em] text-stone">Choose a room</p>
            <div className="space-y-2" role="radiogroup" aria-label="Room type">
              {rooms.map((r) => {
                const ok = fits(guests, r);
                const selected = r.slug === room.slug;
                return (
                  <button
                    key={r.slug}
                    role="radio"
                    aria-checked={selected}
                    disabled={!ok}
                    onClick={() => setSlug(r.slug)}
                    className={`relative flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 ${
                      selected ? "bg-ink text-ivory" : "ring-1 ring-ink/10 hover:bg-sand/50"
                    } ${ok ? "" : "cursor-not-allowed opacity-40"}`}
                  >
                    <span>
                      <span className="block font-serif text-xl leading-tight">{r.name}</span>
                      <span className={`mt-0.5 block text-[12px] ${selected ? "text-ivory/60" : "text-ink/50"}`}>
                        {ok ? roomMeta(r) : `Up to ${r.guests} guests`}
                      </span>
                    </span>
                    <span className="text-right text-[13px] tabular-nums">
                      {formatNaira(r.price)}
                      <span className={`block text-[11px] ${selected ? "text-ivory/50" : "text-ink/40"}`}>per night</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Step>
        </div>

        <motion.footer
          className="border-t border-ink/10 bg-ivory px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
        >
          <div className="flex items-end justify-between gap-4">
            <div className="text-[13px] text-ink/60">
              {room.name}
              <br />
              {nights} night{nights > 1 ? "s" : ""} · {pretty(checkIn)} – {pretty(checkOut)}
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone">Estimate</p>
              <motion.p
                key={total}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease }}
                className="font-serif text-3xl leading-none tabular-nums"
              >
                {formatNaira(total)}
              </motion.p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            <PillButton href={hotel.bookingUrl} external tone="dark" className="w-full">
              Continue to secure booking
            </PillButton>
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2.5 rounded-full text-[13px] font-medium ring-1 ring-inset ring-ink/15 transition-colors hover:bg-sand/60"
            >
              <WhatsAppIcon className="text-[#1f9e55]" />
              Ask on WhatsApp instead
            </a>
          </div>
          <p className="mt-3 text-center text-[11px] text-ink/45">
            Estimate before taxes. Final price confirmed when you book.
          </p>
        </motion.footer>
      </motion.aside>
    </div>
  );
}

function Step({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function DateField({
  label,
  value,
  min,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  min: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`relative block cursor-pointer px-4 py-3.5 transition-colors hover:bg-sand/40 ${className}`}>
      <span className="block text-[11px] uppercase tracking-[0.2em] text-stone">{label}</span>
      <span className="mt-1 block font-serif text-2xl leading-none">{pretty(value)}</span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker();
          } catch {}
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label={label}
      />
    </label>
  );
}

function Stepper({
  children,
  onClick,
  disabled,
  label,
}: {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full text-lg ring-1 ring-ink/15 transition-colors hover:bg-ink hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
