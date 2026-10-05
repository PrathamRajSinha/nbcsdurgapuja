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

export const placeholderContact = {
  address: kaliMandir.address,
  phone: "+91 98863 30772 / +91 94483 50752",
  email: "northbangaloreculturalsamithi@gmail.com",
  facebook: "/bangalore.kalibari",
};