import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { galleryItems } from "@/lib/gallery";
import { instagramSection } from "@/lib/site-content";

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
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <PageShell>
      <main className="inner-page gallery-page">
        <p className="eyebrow">49th year celebration</p>
        <h1>Moments held in light</h1>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <figure key={item.label}><img src={item.image} alt={item.alt} loading="lazy" /><figcaption>{item.label}</figcaption></figure>
          ))}
        </div>
        <a className="insta-follow" href={instagramSection.profileUrl} target="_blank" rel="noopener noreferrer">Follow us on Insta <Instagram /></a>
      </main>
    </PageShell>
  );
}
