import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { StickyActions } from "@/components/StickyActions";
import { amenities, hotel, img, rooms, siteUrl } from "@/data/content";
import { Amenities } from "@/sections/Amenities";
import { Experiences } from "@/sections/Experiences";
import { FinalCta } from "@/sections/FinalCta";
import { Footer } from "@/sections/Footer";
import { Gallery } from "@/sections/Gallery";
import { Hero } from "@/sections/Hero";
import { Intro } from "@/sections/Intro";
import { Rooms } from "@/sections/Rooms";
import { Visit } from "@/sections/Visit";

// Lets Google show the hotel's address, phone, photos and price range directly in results.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: hotel.fullName,
  url: siteUrl,
  telephone: hotel.phone,
  image: [img.facade, img.presidential, img.superDeluxe],
  priceRange: `₦${Math.min(...rooms.map((r) => r.price)).toLocaleString("en-NG")} – ₦${Math.max(...rooms.map((r) => r.price)).toLocaleString("en-NG")}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Road 17, Okania, Ada-George New Road, by Okilton",
    addressLocality: "Port Harcourt",
    addressRegion: "Rivers",
    addressCountry: "NG",
  },
  numberOfRooms: 65,
  amenityFeature: amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a.title, value: true })),
  makesOffer: rooms.map((r) => ({
    "@type": "Offer",
    name: r.name,
    priceCurrency: "NGN",
    price: r.price,
    url: hotel.bookingUrl,
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Preloader />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Intro />
        <Rooms />
        <Experiences />
        <Amenities />
        <Gallery />
        <Visit />
        <FinalCta />
      </main>
      <Footer />
      <StickyActions />
      <Cursor />
    </>
  );
}
