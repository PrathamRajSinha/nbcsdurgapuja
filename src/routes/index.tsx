import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "NBCS | 49th Year Durga Puja 2026" },
    { name: "description", content: "Experience North Bangalore Cultural Samithi's 49th year Durga Puja, 16–21 October 2026." },
    { property: "og:title", content: "NBCS | 49th Year Durga Puja 2026" },
    { property: "og:description", content: "Shri Shri Sharodiya Durga Puja 2026 in Mahalakshmipuram, Bengaluru." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "North Bangalore Cultural Samithi logo" },
    { name: "twitter:image", content: "https://nbcskalibari.com/nbcs-share.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return <HomePage />;
}
