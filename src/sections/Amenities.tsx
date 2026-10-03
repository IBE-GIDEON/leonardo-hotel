import { Reveal } from "@/components/ui";
import { VelocityMarquee } from "@/components/VelocityMarquee";
import { amenities } from "@/data/content";

export function Amenities() {
  const words = amenities.map((a) => a.title);

  return (
    <section className="overflow-hidden bg-ivory pb-36 pt-24 md:pb-52 md:pt-32">
      <VelocityMarquee>
        {words.map((w) => (
          <span
            key={w}
            className="flex items-center font-serif text-[18vw] leading-none tracking-[-0.03em] md:text-[clamp(5rem,10vw,12rem)]"
          >
            <span className="px-[3vw]">{w}</span>
            <span className="size-[1.6vw] max-h-5 max-w-5 rounded-full bg-bronze/70" />
          </span>
        ))}
      </VelocityMarquee>

      <div className="mt-16 grid grid-cols-2 border-t border-ink/10 px-5 md:mx-10 md:mt-24 md:grid-cols-4 md:px-0">
        {amenities.map((a, i) => (
          <Reveal
            key={a.title}
            delay={i * 0.08}
            className="border-b border-ink/10 py-7 odd:pr-5 even:border-l even:pl-5 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
          >
            <p className="text-[11px] tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-6 font-serif text-3xl leading-none">{a.title}</h3>
            <p className="mt-3 text-[14px] text-ink/55">{a.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
