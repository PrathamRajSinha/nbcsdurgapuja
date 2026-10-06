import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";

export const Route = createFileRoute("/gallery")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Gallery | NBCS" },
    { name: "description", content: "NBCS Durga Puja and cultural programme gallery." },
    { property: "og:title", content: "Gallery | NBCS" },
    { property: "og:description", content: "Moments from North Bangalore Cultural Samithi celebrations." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "North Bangalore Cultural Samithi logo" },
    { name: "twitter:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <InnerPage label="49th year celebration" title="Moments held in light" lead="Shri Shri Sharodiya Durga Puja returns from 16–21 October 2026." blocks={[
    { title: "Opening Ceremony", copy: "16 October 2026 · 8:00 PM onwards" },
    { title: "Cultural Programmes", copy: "17–20 October 2026 · 8:00 PM" },
    { title: "Vijaya Sanmilani", copy: "21 October 2026 · 7:30 PM onwards" },
  ]} />,
});