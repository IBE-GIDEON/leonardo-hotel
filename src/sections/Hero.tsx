"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useBooking } from "@/components/Booking";
import { useIntro } from "@/components/Providers";
import { PillButton, SplitText } from "@/components/ui";
import { formatNaira, img, rooms } from "@/data/content";
import { ease } from "@/lib/motion";

export function Hero() {
  const { ready } = useIntro();
  const booking = useBooking();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.55]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentBlur = useTransform(scrollYProgress, [0, 0.6], ["blur(0px)", "blur(10px)"]);

  const from = Math.min(...rooms.map((r) => r.price));

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink text-ivory">
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.3, filter: "blur(14px)" }}
          animate={ready ? { scale: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 2.6, ease }}
        >
          <Image
            src={img.facade}
            alt="The ivory facade of Leonardo Spa Hotel & Suites with wrought-iron balconies"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_40%]"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/15 to-ink/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-ink/40" />
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: shade }} />

      <motion.div
        className="relative flex h-full flex-col justify-end px-5 pb-14 md:px-10 md:pb-20"
        style={{ y: contentY, opacity: contentOpacity, filter: contentBlur }}
      >
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-8">
            <motion.p
              className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-ivory/70"
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease, delay: 0.5 }}
            >
              <span className="h-px w-8 bg-ivory/50" />
              Port Harcourt, Nigeria
            </motion.p>
            <h1 className="font-serif text-[16vw] leading-[0.88] tracking-[-0.025em] sm:text-[12vw] md:text-[clamp(4.5rem,9vw,11.5rem)]">
              <SplitText text="A quiet kind" play={ready} delay={0.35} />
              <br />
              <SplitText text="of *luxury.*" play={ready} delay={0.55} />
            </h1>
          </div>

          <motion.div
            className="md:col-span-5 md:w-full md:max-w-[340px] md:justify-self-end lg:col-span-4"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 1.3, ease, delay: 0.9 }}
          >
            <div className="w-full rounded-3xl bg-ink/35 p-5 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.22em] text-ivory/60">Rooms from</span>
                <span className="text-[11px] text-ivory/60">per night</span>
              </div>
              <p className="mt-2 font-serif text-4xl">{formatNaira(from)}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ivory/70">
                65 rooms and suites, a spa and a private city beach.
              </p>
              <PillButton onClick={() => booking.open()} tone="light" className="mt-5 w-full">
                Check availability
              </PillButton>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 hidden items-center justify-between border-t border-ivory/15 pt-5 text-[11px] uppercase tracking-[0.22em] text-ivory/60 md:flex"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1.3 }}
        >
          <span>Spa · City Beach · Fine Dining</span>
          <span className="flex items-center gap-3">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-ivory/15">
              <span className="scroll-cue absolute inset-0 bg-ivory" />
            </span>
          </span>
          <span>Ada-George, Port Harcourt</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
