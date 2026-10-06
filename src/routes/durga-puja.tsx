import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { durgaPujaSchedule, durgaPujaVenue, pujaDownloads } from "@/lib/site-content";

function PujaDownloads() {
  return (
    <section className="puja-downloads">
      <p className="eyebrow">Share the puja</p>
      <h2>Banners &amp; invites</h2>
      <ul className="download-list">
        {pujaDownloads.map((item) => (
          <li key={item.href}>
            <span className="download-title">{item.label}</span>
            <a className="download-btn" href={item.href} download>
              <Download aria-hidden="true" />
              <span>Download</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const Route = createFileRoute("/durga-puja")({
  head: () => ({ meta: [
    { title: "Durga Puja 2026 | NBCS" },
    { name: "description", content: "Shri Shri Sharodiya Durga Puja, 16–21 October 2026, by North Bangalore Cultural Samithi." },
    { property: "og:title", content: "Durga Puja 2026 | NBCS" },
    { property: "og:description", content: "The complete 2026 puja and cultural programme schedule." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <InnerPage label="49th year celebration · Bangla 1433 Saal" title="Shri Shri Sharodiya Durga Puja" lead={`16–21 October 2026 at ${durgaPujaVenue.name}, ${durgaPujaVenue.address}. Timings are in Indian Standard Time.`} blocks={durgaPujaSchedule} extra={<PujaDownloads />} />,
});
