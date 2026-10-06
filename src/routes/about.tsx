import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "About NBCS" },
    { name: "description", content: "North Bangalore Cultural Samithi welcomes families to its 49th year celebration." },
    { property: "og:title", content: "About NBCS" },
    { property: "og:description", content: "North Bangalore Cultural Samithi's 49th year celebration in 2026." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <InnerPage label="North Bangalore Cultural Samithi" title="49th year celebration" lead="We invite you and your family to join Shri Shri Sharodiya Durga Puja 2026 and share in the festivities and fun." blocks={[
    { title: "Durga Puja", copy: "16–21 October 2026\nMahalakshmipuram, Bengaluru" },
    { title: "Kali Mandir", copy: "8A, FTI Colony, Nandini Layout, Bengaluru — 560 096" },
    { title: "With gratitude", copy: "Your presence and sincere cooperation make our puja and cultural programmes more meaningful and joyful." },
  ]} />,
});