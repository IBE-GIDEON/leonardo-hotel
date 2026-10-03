import { Counter, Label, ParallaxImage, Reveal, ScrollText, SplitText } from "@/components/ui";
import { img, stats } from "@/data/content";

export function Intro() {
  return (
    <section className="sheet bg-ivory px-5 pb-36 pt-24 md:px-10 md:pb-52 md:pt-40">
      <Label n="01">The hotel</Label>

      <ScrollText
        className="mt-10 max-w-[22ch] font-serif text-[9.5vw] leading-[1.02] tracking-[-0.02em] sm:text-[7vw] md:mt-14 md:text-[clamp(3rem,5.2vw,6.75rem)]"
        text="An urban sanctuary in the heart of Port Harcourt, made for *slowing* *down.*"
      />

      <div className="mt-20 grid grid-cols-2 border-t border-ink/10 md:mt-32 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="border-b border-ink/10 py-7 odd:pr-5 even:border-l even:pl-5 md:border-b-0 md:border-l md:px-8 md:py-9 md:first:border-l-0 md:first:pl-0"
          >
            <p className="font-serif text-5xl tracking-[-0.02em] md:text-7xl">
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-stone">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-28 grid gap-12 md:mt-44 md:grid-cols-12 md:gap-10">
        <ParallaxImage
          src={img.team}
          alt="Members of the Leonardo team in the hotel lobby"
          reveal
          amount={6}
          position="50% 15%"
          sizes="(min-width: 768px) 58vw, 100vw"
          className="aspect-[4/5] rounded-[6px] sm:aspect-[5/4] md:col-span-7"
        />
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <Label n="02">Hospitality with heart</Label>
          <h2 className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.02em] md:text-[clamp(2.75rem,4vw,5rem)]">
            <SplitText text="Service that feels *personal.*" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/65">
              A team of 150 who learn your name, your table and how you take your coffee, then quietly get
              it right every time.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
