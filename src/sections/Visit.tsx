import { Faq } from "@/components/Faq";
import { Label, Reveal, SplitText } from "@/components/ui";
import { hotel, img, whatsappLink } from "@/data/content";

export function Visit() {
  const rows = [
    { k: "Address", v: hotel.address.join(", "), href: hotel.mapUrl, cta: "Directions" },
    { k: "Front desk", v: hotel.phone, href: hotel.phoneHref, cta: "Call" },
    {
      k: "WhatsApp",
      v: "Chat with reservations",
      href: whatsappLink("Hello Leonardo, I'd like to ask about a stay."),
      cta: "Message",
    },
    { k: "Food & drinks", v: "Restaurant and bar menu", href: img.menu, cta: "View menu" },
  ];

  return (
    <section id="visit" className="sheet bg-ivory px-5 pb-36 pt-24 md:px-10 md:pb-52 md:pt-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Label n="06">Visit</Label>
          <h2 className="mt-8 font-serif text-[13vw] leading-[0.92] tracking-[-0.025em] sm:text-[9vw] lg:text-[clamp(3.5rem,5.5vw,7rem)]">
            <SplitText text="Find us in" />
            <br />
            <SplitText text="*Ada-George.*" delay={0.1} />
          </h2>
        </div>

        <div className="border-b border-ink/10 lg:col-span-6 lg:col-start-7">
          {rows.map((r, i) => (
            <Reveal key={r.k} delay={i * 0.06}>
              <a
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-2 border-t border-ink/10 py-7 transition-colors duration-500 hover:bg-sand/40 md:grid-cols-[170px_1fr_auto] md:px-3"
              >
                <span className="col-span-2 text-[11px] uppercase tracking-[0.22em] text-stone md:col-span-1">{r.k}</span>
                <span className="font-serif text-2xl leading-tight md:text-3xl">{r.v}</span>
                <span className="relative text-[13px] text-ink/60 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-700 after:ease-out-expo group-hover:after:origin-left group-hover:after:scale-x-100">
                  {r.cta}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-28 grid gap-12 md:mt-40 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Label n="07">Good to know</Label>
          <h2 className="mt-8 font-serif text-[11vw] leading-[0.95] tracking-[-0.02em] sm:text-[7vw] lg:text-[clamp(3rem,4.5vw,5.5rem)]">
            <SplitText text="Before you *arrive.*" />
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Faq />
        </div>
      </div>
    </section>
  );
}
