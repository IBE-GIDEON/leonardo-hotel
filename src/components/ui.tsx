"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ease } from "@/lib/motion";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Blur-up fade for any block of content. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.2, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Word-by-word masked reveal. Wrap a word in *asterisks* to set it in italic.
 * Pass `play` to drive it manually (e.g. after the preloader); otherwise it plays on scroll.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  play,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
}) {
  const words = text.split(" ");
  const hidden = { y: "105%", filter: "blur(8px)" };
  const shown = { y: "0%", filter: "blur(0px)" };
  const trigger =
    play === undefined
      ? { whileInView: shown, viewport: { once: true, margin: "0px 0px -10% 0px" } }
      : { animate: play ? shown : hidden };

  return (
    <span className={className}>
      <span className="sr-only">{text.replaceAll("*", "")}</span>
      {words.map((w, i) => {
        const italic = w.startsWith("*") && w.includes("*", 1);
        const word = w.replaceAll("*", "");
        return (
          <span key={i} aria-hidden>
            <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
              <motion.span
                className={cx("inline-block will-change-transform", italic && "italic")}
                initial={hidden}
                {...trigger}
                transition={{ duration: 1.25, ease, delay: delay + i * stagger }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </span>
  );
}

/** Paragraph that lights up word by word as it scrolls through the viewport. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text.replaceAll("*", "")}</span>
      {words.map((w, i) => {
        const start = i / words.length;
        return (
          <ScrollWord
            key={i}
            word={w}
            progress={scrollYProgress}
            range={[start, start + 1 / words.length]}
          />
        );
      })}
    </p>
  );
}

function ScrollWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const italic = word.startsWith("*");
  return (
    <motion.span aria-hidden style={{ opacity }} className={cx(italic && "italic")}>
      {word.replaceAll("*", "")}{" "}
    </motion.span>
  );
}

/** Image that drifts inside its frame on scroll, optionally wiping in from below the first time it's seen. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "100vw",
  amount = 10,
  reveal = false,
  priority,
  position = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  amount?: number;
  reveal?: boolean;
  priority?: boolean;
  /** CSS object-position, e.g. "50% 20%" to keep faces in frame. */
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <motion.div
      ref={ref}
      className={cx("relative overflow-hidden bg-espresso", className)}
      initial={reveal ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
      whileInView={reveal ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.5, ease }}
    >
      <motion.div
        className="absolute inset-x-0"
        style={{ y, top: `-${amount}%`, bottom: `-${amount}%` }}
        initial={reveal ? { scale: 1.3 } : false}
        whileInView={reveal ? { scale: 1 } : undefined}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.8, ease }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
      </motion.div>
    </motion.div>
  );
}

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 2,
      ease,
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => c.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/** Small numbered section label, e.g. "(02) Rooms & suites". */
export function Label({ n, children, className }: { n: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={cx("flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]", className)} y={12}>
      <span className="opacity-50">({n})</span>
      <span>{children}</span>
    </Reveal>
  );
}

/** Pill button whose label rolls up on hover. Renders a link when given `href`, otherwise a button. */
export function PillButton({
  href,
  onClick,
  children,
  tone = "dark",
  className,
  external,
  icon,
}: {
  href?: string;
  onClick?: () => void;
  children: string;
  tone?: "dark" | "light" | "glass";
  className?: string;
  external?: boolean;
  icon?: ReactNode;
}) {
  const tones = {
    dark: "bg-ink text-ivory hover:bg-espresso",
    light: "bg-ivory text-ink hover:bg-white",
    glass: "bg-white/10 text-ivory ring-1 ring-inset ring-white/20 backdrop-blur-md hover:bg-white/20",
  };
  const classes = cx(
    "group inline-flex h-12 shrink-0 cursor-pointer items-center justify-between gap-5 rounded-full pl-6 pr-2 text-[13px] font-medium tracking-wide whitespace-nowrap transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
    tones[tone],
    className,
  );
  const inner = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-700 ease-out-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-700 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span
        className={cx(
          "grid size-8 place-items-center rounded-full transition-transform duration-700 ease-out-expo",
          !icon && "group-hover:rotate-[-45deg]",
          tone === "light" ? "bg-ink text-ivory" : "bg-ivory text-ink",
        )}
      >
        {icon ?? <Arrow />}
      </span>
    </>
  );

  if (!href) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {inner}
      </button>
    );
  }
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={classes}
    >
      {inner}
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cx("size-4", className)} aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cx("size-3.5", className)} aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Text link with an underline that draws in on hover. */
export function LineLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cx(
        "relative inline-block after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-700 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100",
        className,
      )}
    >
      {children}
    </a>
  );
}
