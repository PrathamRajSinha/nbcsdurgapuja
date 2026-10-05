import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "NBCS | 49th Year Durga Puja 2026" },
    { name: "description", content: "Experience North Bangalore Cultural Samithi's 49th year Durga Puja, 16–21 October 2026." },
    { property: "og:title", content: "NBCS | 49th Year Durga Puja 2026" },
    { property: "og:description", content: "Shri Shri Sharodiya Durga Puja 2026 in Mahalakshmipuram, Bengaluru." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return <HomePage />;
}
