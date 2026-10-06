import durga from "@/assets/durga.png.asset.json";
import dancers from "@/assets/dhunuchi-dancers.png.asset.json";
import lotus from "@/assets/lotus-with-leaf.png.asset.json";
import logo from "@/assets/logo.png.asset.json";
import water from "@/assets/water.png.asset.json";
import type { AccordionGalleryItem } from "@/components/accordion-gallery";

// Placeholder artwork until real festival photos are supplied.
export const galleryItems: AccordionGalleryItem[] = [
  { image: dancers.url, label: "Dhunuchi Naach", alt: "Dhunuchi dancers" },
  { image: lotus.url, label: "Pushpanjali", alt: "Lotus offering" },
  { image: durga.url, label: "Maa Durga", alt: "Durga artwork" },
  { image: water.url, label: "Visarjan", alt: "Sacred water" },
  { image: logo.url, label: "NBCS since 1978", alt: "NBCS emblem" },
];
