import { ReserveButton } from "@/components/Booking";
import { ParallaxImage, PillButton, Reveal, SplitText, WhatsAppIcon } from "@/components/ui";
import { img, whatsappLink } from "@/data/content";

/** Last full-bleed moment before the footer is revealed underneath. */
export function FinalCta() {
  return (
    <section className="sheet overflow-hidden rounded-b-[28px] bg-ink text-ivory md:rounded-b-[44px]">
      <div className="relative flex h-[100svh] min-h-[560px] items-end">
        <div className="absolute inset-0">
          <ParallaxImage
            src={img.presidential}
            alt="The Presidential Suite living room at dusk"
            amount={14}
            sizes="100vw"
            className="h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/30" />

        <div className="relative w-full px-5 pb-14 md:px-10 md:pb-20">
          <Reveal y={12}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/60">Reservations open</p>
          </Reveal>
          <h2 className="mt-6 font-serif text-[16vw] leading-[0.88] tracking-[-0.025em] sm:text-[12vw] md:text-[clamp(4.5rem,9vw,11.5rem)]">
            <SplitText text="Your stay" />
            <br />
            <SplitText text="begins *here.*" delay={0.1} />
          </h2>
          <Reveal delay={0.25} className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-sm text-[15px] leading-relaxed text-ivory/70">
              Choose your dates and your room. We&apos;ll take care of everything else.
            </p>
            <div className="flex flex-wrap gap-2">
              <ReserveButton tone="light">Reserve your stay</ReserveButton>
              <PillButton
                href={whatsappLink("Hello Leonardo, I'd like to ask about a stay.")}
                external
                tone="glass"
                icon={<WhatsAppIcon className="size-3.5" />}
              >
                WhatsApp us
              </PillButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
