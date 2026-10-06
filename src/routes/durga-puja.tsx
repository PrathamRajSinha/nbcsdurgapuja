import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";
import { durgaPujaSchedule, durgaPujaVenue } from "@/lib/site-content";

export const Route = createFileRoute("/durga-puja")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Durga Puja 2026 | NBCS" },
    { name: "description", content: "Shri Shri Sharodiya Durga Puja, 16–21 October 2026, by North Bangalore Cultural Samithi." },
    { property: "og:title", content: "Durga Puja 2026 | NBCS" },
    { property: "og:description", content: "The complete 2026 puja and cultural programme schedule." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "North Bangalore Cultural Samithi logo" },
    { name: "twitter:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <InnerPage label="49th year celebration · Bangla 1433 Saal" title="Shri Shri Sharodiya Durga Puja" lead={`16–21 October 2026 at ${durgaPujaVenue.name}, ${durgaPujaVenue.address}. Timings are in Indian Standard Time.`} blocks={durgaPujaSchedule} />,
});
