// All site copy and imagery lives here, so the hotel team can swap text or photos
// without touching layout code.
//
// Photos are currently served from the live site. Before launch, copy them into
// /public/images, export as WebP at 2400px wide, and update the paths below.

const LIVE = "https://leonardospahotelandsuites.com";

/** Where this site will be deployed. Used for sharing previews, the sitemap and search results. */
export const siteUrl = LIVE;

export const img = {
  facade: `${LIVE}/storage/sliders/aUnLmAlv3QzfiYHn2agsXMjCgF95zni8ROKazlBf.jpg`,
  team: `${LIVE}/storage/about/3K4Us3w4FLlPAVQczLeADZ1IcBZRJBkJC0ZWNvS5.jpg`,
  standard: `${LIVE}/storage/rooms/3ZDKAZeCReDyzhHWDqcWDBakIBV5IjCVt80V2nBC.jpg`,
  superDeluxe: `${LIVE}/storage/rooms/fxKZHZnawc917QAQJPvUmsj4ml3b5BRr9SATthwu.jpg`,
  premiumDeluxe: `${LIVE}/storage/rooms/iSTClKNaDkoqExOhU97vHzG7eFuHeqSt9VPKBoP7.jpg`,
  presidential: `${LIVE}/storage/rooms/f00BM4MBK8DlFIE4b1cTdejyRCOFWc13d0OjML7g.jpg`,
  restaurant: `${LIVE}/images/services/restaurant.jpg`,
  eventHall: `${LIVE}/images/services/event_hall.jpg`,
  cinema: `${LIVE}/images/services/cinema.jpg`,
  menu: `${LIVE}/storage/food-menu/ETbNmTkqp6ToiVqfAtlKyQa1UMD7gFHa5Kb1TipA.png`,
};

export const hotel = {
  name: "Leonardo",
  fullName: "Leonardo Spa Hotel & Suites",
  city: "Port Harcourt",
  bookingUrl: "https://guest.roomability.io/LEONARDOSPAHOTELANDSUITESROAD17N",
  phone: "+234 911 187 6941",
  phoneHref: "tel:+2349111876941",
  address: ["Road 17, Okania, Ada-George New Road", "By Okilton, Port Harcourt, Rivers"],
  // Assumed to be the same number as the phone line; confirm with the hotel.
  whatsapp: "2349111876941",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Leonardo+Spa+Hotel+and+Suites+Ada+George+Port+Harcourt",
};

export const nav = [
  { label: "Rooms", href: "#rooms" },
  { label: "Experiences", href: "#experiences" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
];

export const stats = [
  { value: 65, suffix: "", label: "Rooms & suites" },
  { value: 5.0, suffix: "", label: "Guest rating", decimals: 1 },
  { value: 150, suffix: "+", label: "Team members" },
  { value: 24, suffix: "h", label: "Concierge" },
];

export type Room = {
  slug: string;
  name: string;
  size?: number;
  guests?: number;
  /** Shown instead of size/guests when those aren't known. */
  meta?: string;
  price: number;
  note: string;
  features: string[];
  /** Rooms without a photo still appear in the booking panel, just not in the showcase. */
  image?: string;
};

// Facts below come from the hotel's current website. Fill in the gaps (sizes, capacities)
// with the hotel before launch rather than guessing.
export const rooms: Room[] = [
  {
    slug: "standard-room",
    name: "Standard Room",
    size: 35,
    guests: 2,
    price: 120000,
    note: "A reading desk, an in-room safe and room service whenever you need it.",
    features: ["Free Wi-Fi", "In-room safe", "Reading desk", "Room service"],
    image: img.standard,
  },
  {
    slug: "super-deluxe",
    name: "Super Deluxe",
    size: 45,
    guests: 2,
    price: 140000,
    note: "A king bed, upgraded amenities and a little more room to unwind.",
    features: ["King bed", "Upgraded amenities", "Free Wi-Fi", "Room service"],
    image: img.superDeluxe,
  },
  {
    slug: "premium-deluxe",
    name: "Premium Deluxe",
    meta: "Living area · Workspace",
    price: 160000,
    note: "A separate living area and a premium workspace for longer stays.",
    features: ["Separate living area", "Premium workspace", "Free Wi-Fi", "Room service"],
    image: img.premiumDeluxe,
  },
  {
    slug: "standard-suite",
    name: "Standard Suite",
    meta: "Bedroom · Living room",
    price: 180000,
    note: "A separate bedroom and living room, finished with a marble bathroom.",
    features: ["Separate bedroom", "Living room", "Marble bathroom"],
  },
  {
    slug: "executive-suite",
    name: "Executive Suite",
    size: 90,
    guests: 4,
    price: 200000,
    note: "Room to live, dine and host, with a butler on call.",
    features: ["Living area", "Dining space", "Butler service"],
  },
  {
    slug: "presidential-suite",
    name: "Presidential Suite",
    size: 150,
    guests: 5,
    price: 350000,
    note: "A grand salon, private dining and multiple bedrooms. Your own residence in the city.",
    features: ["Multiple bedrooms", "Grand salon", "Private dining"],
    image: img.presidential,
  },
];

export const featuredRooms = rooms.filter((r): r is Room & { image: string } => Boolean(r.image));

export const roomMeta = (r: Room) => r.meta ?? `${r.size} m² · ${r.guests} guests`;

export const experiences = [
  {
    title: "Fine Dining",
    kicker: "Restaurant",
    text: "Award-winning fine dining in a room made for long evenings.",
    image: img.restaurant,
  },
  {
    title: "Private Cinema",
    kicker: "Screening room",
    text: "Surround sound, deep seats and the whole room to yourselves.",
    image: img.cinema,
  },
  {
    title: "The Grand Hall",
    kicker: "Events",
    text: "Weddings, galas and conferences in our chandeliered ballroom.",
    image: img.eventHall,
  },
];

export const amenities = [
  { title: "Spa & Wellness", text: "Massage, bio-sauna and hot tub" },
  { title: "City Beach", text: "Our own artificial mini beach" },
  { title: "Pool Bar", text: "Premium drinks and light bites" },
  { title: "VIP Lounge", text: "Private, quiet and unhurried" },
];

export const gallery = [
  img.facade,
  img.presidential,
  img.restaurant,
  img.superDeluxe,
  img.eventHall,
  img.standard,
  img.team,
];

export const faqs = [
  {
    q: "How do I book?",
    a: "Use Reserve anywhere on this page to pick your dates and room, then finish online or on WhatsApp. You can also call the front desk.",
  },
  {
    q: "Where exactly are you?",
    a: "Road 17, Okania, off Ada-George New Road, by Okilton, Port Harcourt.",
  },
  {
    q: "Can I host a wedding or conference?",
    a: "Yes. The Grand Hall hosts weddings, galas and conferences. Call or message us to plan the day.",
  },
  {
    q: "Is the spa open to hotel guests?",
    a: "Yes. The spa offers massage, a bio-sauna and a hot tub. Ask the front desk to reserve a time.",
  },
  {
    q: "Is the front desk open at night?",
    a: "Our front desk is staffed 24 hours a day, every day.",
  },
];

export const whatsappLink = (message: string) =>
  `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(message)}`;

export const formatNaira = (n: number) => "₦" + n.toLocaleString("en-NG");
