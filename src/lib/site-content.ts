import nbcsUpiQr from "@/assets/nbcs-upi-qr.png.asset.json";
import saveTheDates from "@/assets/nbcs-save-the-dates.pdf.asset.json";
import grandRevealOne from "@/assets/nbcs-grand-reveal-1.pdf.asset.json";
import grandRevealTwo from "@/assets/nbcs-grand-reveal-2.pdf.asset.json";
import eventBanner from "@/assets/nbcs-event-banner.pdf.asset.json";
import mahaShashti from "@/assets/nbcs-maha-shashti-16-oct.pdf.asset.json";
import mahaSaptami from "@/assets/nbcs-maha-saptami-17-oct.pdf.asset.json";
import mahaAshtamiDandiya from "@/assets/nbcs-maha-ashtami-18-oct-dandiya.pdf.asset.json";
import mahaAshtamiSandhi from "@/assets/nbcs-maha-ashtami-19-oct.pdf.asset.json";
import mahaNavami from "@/assets/nbcs-maha-navami-20-oct.pdf.asset.json";
import vijayaDashami from "@/assets/nbcs-vijaya-dashami-21-oct.pdf.asset.json";
import anandamela from "@/assets/nbcs-anandamela.pdf.asset.json";
import dhunachiDance from "@/assets/nbcs-dhunachi-dance.pdf.asset.json";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Durga Puja", href: "/durga-puja" },
  { label: "Kali Bari", href: "/kali-bari" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const festivalDates = [
  { date: "16 — 21 OCT", title: "Shri Shri Sharodiya Durga Puja", note: "Friday to Wednesday, 2026" },
  { date: "25 OCT", title: "Shri Shri Kojagari Lakshmi Puja", note: "Sunday, 2026 · 7:00 PM — 9:00 PM" },
  { date: "08 NOV", title: "Shri Shri Shyama Puja", note: "Sunday, 2026 · 9:00 PM — 3:00 AM" },
  { date: "18 NOV", title: "Shri Shri Jagadhatri Puja", note: "Wednesday, 2026 · 10:00 AM — 3:00 PM" },
  { date: "11 FEB", title: "Shri Shri Saraswati Puja", note: "Thursday, 2027 · 10:00 AM — 1:00 PM" },
];

export const durgaPujaSchedule = [
  {
    title: "Maha Sashthi · 16 October",
    copy: "Friday · 28th Ashwin\n6:00 PM onwards — Bodhan, Sashthi Puja, Anjali Amantran & Adhibas\n8:00 PM onwards — Opening Ceremony & Anandamela",
  },
  {
    title: "Maha Saptami · 17 October",
    copy: "Saturday · 29th Ashwin\n7:00 AM — 10:30 AM — Nava Patrika Pravesh, Sthapan & Maha Saptami Puja at 9:00 AM\n10:30 AM — 12:30 PM — Puspanjali, Chandipath, Bhog & Arati\n7:00 PM — Sandhya Arati\n8:00 PM — Cultural Programme",
  },
  {
    title: "Maha Astami · 18 October",
    copy: "Sunday · 30th Ashwin\n9:00 AM — 12:30 PM — Puja, Puspanjali, Chandipath, Bhog & Arati\n7:00 PM — Sandhya Arati\n8:00 PM — Cultural Programme",
  },
  {
    title: "Maha Astami & Sandhi Puja · 19 October",
    copy: "Monday · 1st Kartik\n6:00 AM — 7:30 AM — Maha Astami Puja, Puspanjali, Chandipath, Bhog & Arati\n7:26 AM — 8:14 AM — Sandhi Puja, Balidan, Deep Daan, Puspanjali, Bhog & Arati\n9:00 AM — 12:30 PM — Atirikta Puja, Puspanjali, Chandipath, Bhog & Arati\n7:00 PM — Sandhya Arati\n8:00 PM — Cultural Programme",
  },
  {
    title: "Maha Navami · 20 October",
    copy: "Tuesday · 2nd Kartik\n7:00 AM — Navami Puja\n9:30 AM — 12:30 PM — Puspanjali, Chandipath, Bhog & Arati\n1:00 PM — 2:00 PM — Homam (Havan)\n7:00 PM — Sandhya Arati\n8:00 PM — Cultural Programme",
  },
  {
    title: "Vijaya Dasami · 21 October",
    copy: "Wednesday · 3rd Kartik\n7:00 AM — 10:47 AM — Vijaya Dashami Puja, Puspanjali & Darpan Visarjan\n11:30 AM onwards — Devi Baran & Sindurdaan\n2:00 PM onwards — Niranjan Yatra\n7:30 PM onwards — Vijaya Sanmilani",
  },
];

export const durgaPujaVenue = {
  name: "Sadumatadha Sadara Vidyabhivrudhi Sangha",
  address: 'No. 5A, 4th “A” Main Road, 12th Cross, West of Chord Road, Mahalakshmipuram, Bengaluru — 560 086',
  locationUrl: "https://www.myloc.in/nbcsdurgapuja",
};

export const kaliMandir = {
  name: "Kali Mandir",
  address: "8A, FTI Colony, Nandini Layout, Bengaluru — 560 096",
  locationUrl: "https://www.myloc.in/bangalorekalibari",
  website: "https://www.nbcskalibari.com",
};

export const impact = [
  { value: "20,000+", label: "Visitors" },
  { value: "9,000+", label: "Community meals" },
  { value: "15", label: "Stalls" },
  { value: "2", label: "Puja awards" },
];

export const contactNumbers = [
  { label: "Partho", phone: "+91 94483 50752" },
  { label: "Dhrubo", phone: "+91 98863 30772" },
];

export const placeholderContact = {
  address: kaliMandir.address,
  phone: contactNumbers.map((person) => `${person.phone} — ${person.label}`).join(" · "),
  email: "northbangaloreculturalsamithi@gmail.com",
  facebook: "https://www.facebook.com/NorthBangaloreCulturalAssociation",
  instagram: "https://www.instagram.com/n.b.c.s",
  website: "https://www.nbcskalibari.com",
};

export const festivalPride = {
  tagline: "Pujo te ashun dekha hobe!",
  established: "Estd: 1978",
  awards: "Winner of “Best Pushpanjali”, “Best Protima”, “Best Midsized Pujo”, “Best Bhog & Prasad” among many others",
};

export const instagramSection = {
  profileUrl: placeholderContact.instagram,
  reelUrl: "https://www.instagram.com/reel/DcJQYwYvuEj/",
};

export const madeBy = {
  label: "Made by",
  url: "https://pages.dutaly.com/",
};

export const membershipForm = {
  label: "Become a member",
  shortLabel: "Member",
  url: "https://docs.google.com/forms/d/e/1FAIpQLSdenBiAmhcHMz8Uh-OmhGC7zIEJnsATRH4GhAgeHLksRn-tGg/viewform",
};

export const donation = {
  upiId: "bom250801320160@mahb",
  payeeName: "THE NORTH BANGALORE CULTU",
  bankName: "Bank of Maharashtra",
  qrUrl: nbcsUpiQr.url,
  qrDownloadName: "nbcs-upi-qr.png",
  presets: [501, 1001, 2501, 5001],
};

export type FooterLink = {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "globe" | "pin" | "temple" | "member" | "mail" | "phone";
  wide?: boolean;
};

export const footerLinks: FooterLink[] = [
  { label: "Facebook", href: placeholderContact.facebook, icon: "facebook" },
  { label: "Instagram", href: placeholderContact.instagram, icon: "instagram" },
  { label: "www.nbcskalibari.com", href: placeholderContact.website, icon: "globe" },
  { label: "Durga Puja location", href: durgaPujaVenue.locationUrl, icon: "pin" },
  { label: "Kali Bari location", href: kaliMandir.locationUrl, icon: "temple" },
  { label: membershipForm.label, href: membershipForm.url, icon: "member" },
  { label: placeholderContact.email, href: `mailto:${placeholderContact.email}`, icon: "mail", wide: true },
  ...contactNumbers.map((person): FooterLink => ({
    label: `${person.label} · ${person.phone}`,
    href: `tel:${person.phone.replace(/\s/g, "")}`,
    icon: "phone",
    wide: true,
  })),
];

export type PujaDownload = { label: string; href: string };

export const pujaDownloads: PujaDownload[] = [
  { label: "Save the Dates — Sharodiya Durga Puja 2026", href: saveTheDates.url },
  { label: "Grand Reveal — The Lotus Unveils Maa Durga", href: grandRevealOne.url },
  { label: "Grand Reveal — 49th Year Puja Celebration", href: grandRevealTwo.url },
  { label: "49th Year Celebration — Event Banner", href: eventBanner.url },
  { label: "Maha Shashti · Friday 16 October", href: mahaShashti.url },
  { label: "Maha Saptami · Saturday 17 October", href: mahaSaptami.url },
  { label: "Maha Ashtami · Sunday 18 October — Dandiya Night", href: mahaAshtamiDandiya.url },
  { label: "Maha Ashtami & Sandhi · Monday 19 October", href: mahaAshtamiSandhi.url },
  { label: "Maha Navami · Tuesday 20 October", href: mahaNavami.url },
  { label: "Vijaya Dashami · Wednesday 21 October", href: vijayaDashami.url },
  { label: "Anandamela — Home-made Bengali Food", href: anandamela.url },
  { label: "Dhunachi Dance · Navami", href: dhunachiDance.url },
];
