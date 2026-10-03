"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Label, SplitText } from "@/components/ui";
import { gallery } from "@/data/content";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Position and size of each frame around the centre one. The centre frame scales 4x,
// which takes it from 25vw to exactly full width by the end of the section.
const wideFrames = [
  { w: "25vw", h: "25vh", top: "0", left: "0", scale: 4 },
  { w: "35vw", h: "30vh", top: "-30vh", left: "5vw", scale: 5 },
  { w: "20vw", h: "45vh", top: "-10vh", left: "-25vw", scale: 6 },
  { w: "25vw", h: "25vh", top: "0", left: "27.5vw", scale: 5 },
  { w: "20vw", h: "25vh", top: "27.5vh", left: "5vw", scale: 6 },
  { w: "30vw", h: "25vh", top: "27.5vh", left: "-22.5vw", scale: 8 },
  { w: "15vw", h: "15vh", top: "22.5vh", left: "25vw", scale: 9 },
];

// Portrait screens: bigger, taller frames so the collage still reads at 390px wide.
// The centre frame (30vh) overshoots full height at 4x, so it always fills the screen.
const tallFrames = [
  { w: "52vw", h: "30vh", top: "0", left: "0", scale: 4 },
  { w: "42vw", h: "19vh", top: "-29vh", left: "-24vw", scale: 5 },
  { w: "36vw", h: "22vh", top: "-28vh", left: "26vw", scale: 6 },
  { w: "30vw", h: "20vh", top: "0", left: "-44vw", scale: 5 },
  { w: "30vw", h: "20vh", top: "2vh", left: "44vw", scale: 6 },
  { w: "44vw", h: "19vh", top: "29vh", left: "-22vw", scale: 8 },
  { w: "36vw", h: "17vh", top: "28vh", left: "26vw", scale: 9 },
];

type FrameSpec = (typeof wideFrames)[number];

export function Gallery() {
  const portrait = useMediaQuery("(max-aspect-ratio: 4/5)");
  const frames = portrait ? tallFrames : wideFrames;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const caption = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  const captionBlur = useTransform(scrollYProgress, [0.75, 0.95], ["blur(12px)", "blur(0px)"]);
  const shade = useTransform(scrollYProgress, [0.6, 0.95], [0, 0.6]);

  return (
    <section id="gallery" className="sheet bg-ink text-ivory">
      <div className="px-5 pb-16 pt-24 md:px-10 md:pt-40">
        <Label n="05">Gallery</Label>
        <h2 className="mt-8 font-serif text-[13vw] leading-[0.92] tracking-[-0.025em] sm:text-[9vw] md:text-[clamp(3.5rem,6vw,7.5rem)]">
          <SplitText text="A glimpse *inside.*" />
        </h2>
      </div>

      <div ref={ref} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {frames.map((f, i) => (
            <Frame key={i} src={gallery[i]} frame={f} progress={scrollYProgress} />
          ))}
          <motion.div className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: shade }} />
          <motion.p
            className="absolute inset-x-0 bottom-[14vh] text-center font-serif text-[12vw] leading-none tracking-[-0.02em] md:text-[clamp(3rem,5.5vw,7rem)]"
            style={{ opacity: caption, filter: captionBlur }}
          >
            Come and <span className="italic">stay.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function Frame({
  src,
  frame,
  progress,
}: {
  src: string;
  frame: FrameSpec;
  progress: MotionValue<number>;
}) {
  const scale = useTransform(progress, [0, 1], [1, frame.scale]);
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ scale }}>
      <div
        className="relative overflow-hidden"
        style={{ width: frame.w, height: frame.h, top: frame.top, left: frame.left }}
      >
        <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
      </div>
    </motion.div>
  );
}
