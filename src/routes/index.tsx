import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "NBCS | 49th Year Durga Puja" },
    { name: "description", content: "Experience the 49th year of North Bangalore Cultural Samithi's Durga Puja and cultural celebrations." },
    { property: "og:title", content: "NBCS | 49th Year Durga Puja" },
    { property: "og:description", content: "Culture, community and celebration in North Bangalore." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <HomePage />;
}
