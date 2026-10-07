import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";
import { placeholderContact } from "@/lib/site-content";

export const Route = createFileRoute("/sponsors")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Support NBCS" },
    { name: "description", content: "Support North Bangalore Cultural Samithi's 49th year celebration." },
    { property: "og:title", content: "Support NBCS" },
    { property: "og:description", content: "Get in touch with NBCS for the 2026 celebration." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "North Bangalore Cultural Samithi logo" },
    { name: "twitter:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <InnerPage label="49th year celebration" title="Celebrate with us" lead="Your presence and sincere cooperation make our puja and cultural programmes more meaningful and joyful." blocks={[
    { title: "Call", copy: placeholderContact.phone },
    { title: "Email", copy: placeholderContact.email },
    { title: "Visit online", copy: "nbcskalibari.com" },
  ]} />,
});