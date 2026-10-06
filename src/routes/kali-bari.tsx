import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";
import { kaliMandir } from "@/lib/site-content";

export const Route = createFileRoute("/kali-bari")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Kali Mandir | NBCS" },
    { name: "description", content: "NBCS Kali Mandir in Nandini Layout, Bengaluru." },
    { property: "og:title", content: "Kali Mandir | NBCS" },
    { property: "og:description", content: "Puja dates, location and visiting information for NBCS Kali Mandir." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "North Bangalore Cultural Samithi logo" },
    { name: "twitter:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "HinduTemple", name: "NBCS Kali Mandir", address: kaliMandir.address, url: "https://nbcskalibari.com/kali-bari", hasMap: kaliMandir.locationUrl }) }],
  }),
  component: () => <InnerPage label="NBCS Kali Mandir" title="A deeper devotion" lead={kaliMandir.address} blocks={[
    { title: "Kojagari Lakshmi Puja", copy: "25 October 2026 · Sunday\n7:00 PM — 9:00 PM" },
    { title: "Shyama Puja", copy: "8 November 2026 · Sunday\n9:00 PM — 3:00 AM" },
    { title: "Jagadhatri Puja", copy: "18 November 2026 · Wednesday\n10:00 AM — 3:00 PM" },
    { title: "Saraswati Puja", copy: "11 February 2027 · Thursday\n10:00 AM — 1:00 PM" },
    { title: "Location", copy: `${kaliMandir.address}\n${kaliMandir.locationUrl}` },
    { title: "Website", copy: kaliMandir.website },
  ]} />,
});