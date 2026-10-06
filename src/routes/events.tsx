import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";
import { durgaPujaVenue, festivalDates, kaliMandir } from "@/lib/site-content";

export const Route = createFileRoute("/events")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "2026 Puja Calendar | NBCS" },
    { name: "description", content: "NBCS Durga, Lakshmi, Shyama, Jagadhatri and Saraswati Puja dates for 2026–27." },
    { property: "og:title", content: "2026 Puja Calendar | NBCS" },
    { property: "og:description", content: "The official NBCS festival dates and timings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://nbcskalibari.com/events" }],
  scripts: [{ type: "application/ld+json", children: JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Event", name: "Shri Shri Sharodiya Durga Puja 2026", startDate: "2026-10-16", endDate: "2026-10-21", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", organizer: { "@type": "Organization", name: "North Bangalore Cultural Samithi", url: "https://nbcskalibari.com" }, location: { "@type": "Place", name: durgaPujaVenue.name, address: durgaPujaVenue.address } },
      ...[
        ["Shri Shri Kojagari Lakshmi Puja", "2026-10-25T19:00:00+05:30", "2026-10-25T21:00:00+05:30"],
        ["Shri Shri Shyama Puja", "2026-11-08T21:00:00+05:30", "2026-11-09T03:00:00+05:30"],
        ["Shri Shri Jagadhatri Puja", "2026-11-18T10:00:00+05:30", "2026-11-18T15:00:00+05:30"],
        ["Shri Shri Saraswati Puja", "2027-02-11T10:00:00+05:30", "2027-02-11T13:00:00+05:30"],
      ].map(([name, startDate, endDate]) => ({ "@type": "Event", name, startDate, endDate, eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", organizer: { "@type": "Organization", name: "North Bangalore Cultural Samithi", url: "https://nbcskalibari.com" }, location: { "@type": "Place", name: kaliMandir.name, address: kaliMandir.address } })),
    ],
  }) }],
  }),
  component: () => <InnerPage label="49th year celebration" title="Puja calendar 2026–27" lead="Join North Bangalore Cultural Samithi for the sacred days and shared celebrations ahead." blocks={festivalDates.map((event) => ({ title: `${event.date} · ${event.title}`, copy: event.note }))} />,
});