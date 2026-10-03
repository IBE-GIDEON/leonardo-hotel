"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqs } from "@/data/content";
import { ease } from "@/lib/motion";
import { Reveal } from "./ui";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-b border-ink/10">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={i * 0.05} y={16}>
            <div className="border-t border-ink/10">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left md:px-3"
              >
                <span className="font-serif text-2xl leading-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-1 md:text-3xl">
                  {f.q}
                </span>
                <span className="relative grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-ink/15 transition-colors duration-500 group-hover:bg-ink group-hover:text-ivory">
                  <span className="absolute h-px w-3 bg-current" />
                  <motion.span
                    className="absolute h-3 w-px bg-current"
                    animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.5, ease }}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                    animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                    exit={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.6, ease }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-lg pb-7 text-[15px] leading-relaxed text-ink/60 md:px-3">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
