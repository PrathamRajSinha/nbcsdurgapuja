import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";
import { festivalDates } from "@/lib/site-content";

export const Route = createFileRoute("/events")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "2026 Puja Calendar | NBCS" },
    { name: "description", content: "NBCS Durga, Lakshmi, Shyama, Jagadhatri and Saraswati Puja dates for 2026–27." },
    { property: "og:title", content: "2026 Puja Calendar | NBCS" },
    { property: "og:description", content: "The official NBCS festival dates and timings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <InnerPage label="49th year celebration" title="Puja calendar 2026–27" lead="Join North Bangalore Cultural Samithi for the sacred days and shared celebrations ahead." blocks={festivalDates.map((event) => ({ title: `${event.date} · ${event.title}`, copy: event.note }))} />,
});