"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Label, ParallaxImage, Reveal, SplitText } from "@/components/ui";
import { experiences } from "@/data/content";
import { ease } from "@/lib/motion";

/** Sticky image on the left cross-fades (with a blur) as each experience scrolls past on the right. */
export function Experiences() {
  const [active, setActive] = useState(0);

  return (
    <section id="experiences" className="sheet bg-ivory px-5 pt-24 md:px-10 md:pt-40">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <Label n="04">Experiences</Label>
          <h2 className="mt-8 font-serif text-[13vw] leading-[0.92] tracking-[-0.025em] sm:text-[9vw] md:text-[clamp(3.5rem,6vw,7.5rem)]">
            <SplitText text="Stay in." />
            <br />
            <SplitText text="*Go nowhere.*" delay={0.1} />
          </h2>
        </div>
        <Reveal delay={0.2} className="self-end md:col-span-4 md:col-start-9">
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/60">
            Dinner, drinks, a private screening or a wedding. All of it without leaving the hotel.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid lg:mt-10 lg:grid-cols-12 lg:gap-10">
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative aspect-[4/5] max-h-[78vh] w-full overflow-hidden rounded-[6px] bg-espresso">
              {experiences.map((e, i) => (
                <motion.div
                  key={e.title}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    scale: active === i ? 1 : 1.1,
                    filter: active === i ? "blur(0px)" : "blur(16px)",
                  }}
                  transition={{ duration: 1.2, ease }}
                >
                  <Image src={e.image} alt={e.title} fill sizes="50vw" className="object-cover" />
                </motion.div>
              ))}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/60 to-transparent p-5 pt-16 text-[11px] uppercase tracking-[0.22em] text-ivory">
                <span>{experiences[active].kicker}</span>
                <span className="tabular-nums">
                  {String(active + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          {experiences.map((e, i) => (
            <Item key={e.title} index={i} onActive={setActive} active={active === i} {...e} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Item({
  index,
  title,
  kicker,
  text,
  image,
  active,
  onActive,
}: {
  index: number;
  title: string;
  kicker: string;
  text: string;
  image: string;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="border-t border-ink/10 py-10 md:grid md:grid-cols-2 md:items-center md:gap-10 lg:flex lg:min-h-[75vh] lg:flex-col lg:items-stretch lg:justify-center lg:py-0">
      <ParallaxImage src={image} alt={title} reveal sizes="100vw" className="mb-8 aspect-[4/3] rounded-[6px] md:mb-0 lg:hidden" />
      <motion.div
        animate={{ opacity: active ? 1 : 0.28 }}
        transition={{ duration: 0.8, ease }}
        className="max-lg:!opacity-100"
      >
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
          {String(index + 1).padStart(2, "0")} — {kicker}
        </p>
        <h3 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.02em] lg:text-[clamp(3rem,4.2vw,5.25rem)]">{title}</h3>
        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink/60">{text}</p>
      </motion.div>
    </div>
  );
}
