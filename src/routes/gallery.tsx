import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { PageShell } from "@/components/site-chrome";
import { galleryItems } from "@/lib/gallery";
import { instagramSection } from "@/lib/site-content";
import DomeGallery from "@/components/dome-gallery";

const domeImages = galleryItems.map((item) => ({ src: item.image, alt: item.alt || item.label }));

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
      <main className="gallery-dome-page">
        <div className="gallery-dome-heading">
        <p className="eyebrow">49th year celebration</p>
        <h1>Moments held in light</h1>
        </div>
        <div className="gallery-dome">
          <DomeGallery images={domeImages} grayscale={false} minRadius={380} fit={0.65} padFactor={0.12} overlayBlurColor="var(--kali)" openedImageWidth="min(560px, 82vw)" openedImageHeight="min(560px, 50svh)" imageBorderRadius="8px" openedImageBorderRadius="8px" />
        </div>
        <a className="insta-follow" href={instagramSection.profileUrl} target="_blank" rel="noopener noreferrer">Follow us on Insta <Instagram /></a>
      </main>
    </PageShell>
  );
}
