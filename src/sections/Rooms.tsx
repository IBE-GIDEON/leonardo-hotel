"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useBooking } from "@/components/Booking";
import { RoomOverlay } from "@/components/RoomOverlay";
import { Arrow, Label, PillButton, Reveal, SplitText } from "@/components/ui";
import { featuredRooms, formatNaira, roomMeta } from "@/data/content";
import { DESKTOP } from "@/lib/useMediaQuery";
import { ease } from "@/lib/motion";
import { CARD_SIZES } from "@/lib/sizes";

type Open = { index: number; rect: DOMRect };

/**
 * Desktop (≥1024px): the section pins and vertical scroll drives the row sideways.
 * Phone & tablet: a native swipe row with snap points and a progress line.
 */
export function Rooms() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [open, setOpen] = useState<Open | null>(null);
  // Kept separately so the card stays hidden until the overlay has finished flying back into it.
  const [hiddenIndex, setHiddenIndex] = useState<number | null>(null);
  const { open: openBooking } = useBooking();

  useLayoutEffect(() => {
    const measure = () => {
      const desktop = window.matchMedia(DESKTOP).matches;
      setDistance(desktop && track.current ? track.current.scrollWidth - window.innerWidth : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const { scrollXProgress } = useScroll({ container: track });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const pinned = distance > 0;

  return (
    <section
      id="rooms"
      ref={section}
      className="sheet bg-ink text-ivory"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="flex flex-col justify-center overflow-hidden py-24 md:py-32 lg:sticky lg:top-0 lg:h-screen lg:py-0">
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className="flex w-full snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 [scrollbar-width:none] md:scroll-px-10 md:gap-6 md:px-10 lg:w-max lg:snap-none lg:gap-8 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-between sm:w-[46vw] lg:w-[34vw] lg:pr-10">
            <div>
              <Label n="03">Rooms &amp; suites</Label>
              <h2 className="mt-8 font-serif text-[15vw] leading-[0.92] tracking-[-0.025em] sm:text-[9vw] lg:text-[clamp(4rem,6.5vw,8.5rem)]">
                <SplitText text="Rest," />
                <br />
                <SplitText text="*beautifully.*" delay={0.1} />
              </h2>
            </div>
            <Reveal delay={0.2} className="mt-10 max-w-xs lg:mt-0">
              <p className="text-[15px] leading-relaxed text-ivory/60">
                Sixty-five rooms and suites, from a restful standard room to a presidential residence. Tap a room
                to look inside.
              </p>
              <div className="mt-8 hidden items-center gap-4 lg:flex">
                <div className="h-px w-40 bg-ivory/15">
                  <motion.div className="h-full origin-left bg-ivory" style={{ scaleX: scrollYProgress }} />
                </div>
                <span className="text-[11px] uppercase tracking-[0.22em] text-ivory/50">Scroll</span>
              </div>
            </Reveal>
          </div>

          {featuredRooms.map((room, i) => (
            <RoomCard
              key={room.slug}
              room={room}
              index={i}
              hidden={hiddenIndex === i}
              onOpen={(rect) => {
                setOpen({ index: i, rect });
                setHiddenIndex(i);
              }}
            />
          ))}

          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center gap-8 rounded-[6px] border border-ivory/10 p-8 sm:w-[46vw] lg:w-[26vw]">
            <p className="font-serif text-4xl leading-[1.05] lg:text-[clamp(2rem,2.6vw,3.25rem)]">
              Six room types.
              <br />
              <span className="italic text-ivory/60">One standard.</span>
            </p>
            <PillButton onClick={() => openBooking()} tone="light" className="self-start">
              Compare all rooms
            </PillButton>
          </div>
        </motion.div>

        <div className="mx-5 mt-8 flex items-center gap-4 md:mx-10 lg:hidden">
          <div className="h-px flex-1 bg-ivory/15">
            <motion.div className="h-full origin-left bg-ivory" style={{ scaleX: scrollXProgress }} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ivory/50">Swipe</span>
        </div>
      </div>

      <AnimatePresence onExitComplete={() => setHiddenIndex(null)}>
        {open && <RoomOverlay key="room" startIndex={open.index} from={open.rect} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function RoomCard({
  room,
  index,
  hidden,
  onOpen,
}: {
  room: (typeof featuredRooms)[number];
  index: number;
  hidden: boolean;
  onOpen: (rect: DOMRect) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);

  return (
    <motion.button
      type="button"
      data-cursor="View"
      onClick={() => frame.current && onOpen(frame.current.getBoundingClientRect())}
      className="group block w-[82vw] shrink-0 snap-start text-left sm:w-[46vw] lg:w-[28vw]"
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px -5% 0px 0px" }}
      transition={{ duration: 1.2, ease, delay: index * 0.08 }}
      aria-label={`View ${room.name}`}
    >
      <div
        ref={frame}
        className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-espresso lg:aspect-auto lg:h-[62vh]"
        style={{ visibility: hidden ? "hidden" : undefined }}
      >
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes={CARD_SIZES}
          className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.06]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ink/40 px-3 py-1.5 text-[11px] tracking-wide backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-ivory text-ink transition-all duration-700 ease-out-expo lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <Arrow className="-rotate-45" />
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-serif text-3xl leading-none">{room.name}</h3>
          <p className="mt-2 text-[13px] text-ivory/50">{roomMeta(room)}</p>
        </div>
        <p className="text-right text-[13px] leading-tight text-ivory/80">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-ivory/40">From</span>
          {formatNaira(room.price)}
        </p>
      </div>
    </motion.button>
  );
}
