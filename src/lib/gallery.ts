import type { AccordionGalleryItem } from "@/components/accordion-gallery";
import { galleryCopy } from "@/lib/site-content";
import photo0 from "@/assets/gallery/20241012_223159.webp.asset.json";
import photo1 from "@/assets/gallery/20241013_142546.webp.asset.json";
import photo2 from "@/assets/gallery/avi08580.webp.asset.json";
import photo3 from "@/assets/gallery/avi08614.webp.asset.json";
import photo4 from "@/assets/gallery/dsc06822.webp.asset.json";
import photo5 from "@/assets/gallery/dsc06848.webp.asset.json";
import photo6 from "@/assets/gallery/dsc06864.webp.asset.json";
import photo7 from "@/assets/gallery/dsc06873.webp.asset.json";
import photo8 from "@/assets/gallery/dsc06886.webp.asset.json";
import photo9 from "@/assets/gallery/dsc06923.webp.asset.json";
import photo10 from "@/assets/gallery/dsc06943.webp.asset.json";
import photo11 from "@/assets/gallery/dsc06953.webp.asset.json";
import photo12 from "@/assets/gallery/dsc06969.webp.asset.json";
import photo13 from "@/assets/gallery/dsc06995.webp.asset.json";
import photo14 from "@/assets/gallery/dsc07159-1.webp.asset.json";
import photo15 from "@/assets/gallery/dsc07160.webp.asset.json";
import photo16 from "@/assets/gallery/dsc07189.webp.asset.json";
import photo17 from "@/assets/gallery/dsc07193.webp.asset.json";
import photo18 from "@/assets/gallery/dsc07198.webp.asset.json";
import photo19 from "@/assets/gallery/dsc07223.webp.asset.json";
import photo20 from "@/assets/gallery/dsc07229.webp.asset.json";
import photo21 from "@/assets/gallery/dsc07477.webp.asset.json";
import photo22 from "@/assets/gallery/dsc07570.webp.asset.json";
import photo23 from "@/assets/gallery/dsc07769.webp.asset.json";
import photo24 from "@/assets/gallery/dsc07821.webp.asset.json";
import photo25 from "@/assets/gallery/dsc07904.webp.asset.json";
import photo26 from "@/assets/gallery/dsc08190.webp.asset.json";
import photo27 from "@/assets/gallery/dsc08200.webp.asset.json";
import photo28 from "@/assets/gallery/dsc08214.webp.asset.json";
import photo29 from "@/assets/gallery/dsc08243.webp.asset.json";
import photo30 from "@/assets/gallery/dsc08265.webp.asset.json";
import photo31 from "@/assets/gallery/dsc08305.webp.asset.json";
import photo32 from "@/assets/gallery/dsc08319.webp.asset.json";
import photo33 from "@/assets/gallery/dsc08350.webp.asset.json";
import photo34 from "@/assets/gallery/dsc08394.webp.asset.json";
import photo35 from "@/assets/gallery/dsc08434.webp.asset.json";
import photo36 from "@/assets/gallery/dsc08473.webp.asset.json";
import photo37 from "@/assets/gallery/dsc08628.webp.asset.json";
import photo38 from "@/assets/gallery/dsc08644.webp.asset.json";
import photo39 from "@/assets/gallery/dsc08647.webp.asset.json";
import photo40 from "@/assets/gallery/dsc08687.webp.asset.json";
import photo41 from "@/assets/gallery/dsc08710.webp.asset.json";
import photo42 from "@/assets/gallery/dsc08836.webp.asset.json";
import photo43 from "@/assets/gallery/dsc08875.webp.asset.json";
import photo44 from "@/assets/gallery/dsc08880.webp.asset.json";
import photo45 from "@/assets/gallery/dsc08917.webp.asset.json";
import photo46 from "@/assets/gallery/dsc09203.webp.asset.json";
import photo47 from "@/assets/gallery/dsc09234.webp.asset.json";
import photo48 from "@/assets/gallery/dsc09255.webp.asset.json";
import photo49 from "@/assets/gallery/dsc09296.webp.asset.json";
import photo50 from "@/assets/gallery/dsc09433.webp.asset.json";
import photo51 from "@/assets/gallery/img-20241010-wa0104.webp.asset.json";
import photo52 from "@/assets/gallery/img_1176.webp.asset.json";
import photo53 from "@/assets/gallery/img_5147.webp.asset.json";

const photos = [
  { filename: "20241012_223159.webp", url: photo0.url },
  { filename: "20241013_142546.webp", url: photo1.url },
  { filename: "avi08580.webp", url: photo2.url },
  { filename: "avi08614.webp", url: photo3.url },
  { filename: "dsc06822.webp", url: photo4.url },
  { filename: "dsc06848.webp", url: photo5.url },
  { filename: "dsc06864.webp", url: photo6.url },
  { filename: "dsc06873.webp", url: photo7.url },
  { filename: "dsc06886.webp", url: photo8.url },
  { filename: "dsc06923.webp", url: photo9.url },
  { filename: "dsc06943.webp", url: photo10.url },
  { filename: "dsc06953.webp", url: photo11.url },
  { filename: "dsc06969.webp", url: photo12.url },
  { filename: "dsc06995.webp", url: photo13.url },
  { filename: "dsc07159-1.webp", url: photo14.url },
  { filename: "dsc07160.webp", url: photo15.url },
  { filename: "dsc07189.webp", url: photo16.url },
  { filename: "dsc07193.webp", url: photo17.url },
  { filename: "dsc07198.webp", url: photo18.url },
  { filename: "dsc07223.webp", url: photo19.url },
  { filename: "dsc07229.webp", url: photo20.url },
  { filename: "dsc07477.webp", url: photo21.url },
  { filename: "dsc07570.webp", url: photo22.url },
  { filename: "dsc07769.webp", url: photo23.url },
  { filename: "dsc07821.webp", url: photo24.url },
  { filename: "dsc07904.webp", url: photo25.url },
  { filename: "dsc08190.webp", url: photo26.url },
  { filename: "dsc08200.webp", url: photo27.url },
  { filename: "dsc08214.webp", url: photo28.url },
  { filename: "dsc08243.webp", url: photo29.url },
  { filename: "dsc08265.webp", url: photo30.url },
  { filename: "dsc08305.webp", url: photo31.url },
  { filename: "dsc08319.webp", url: photo32.url },
  { filename: "dsc08350.webp", url: photo33.url },
  { filename: "dsc08394.webp", url: photo34.url },
  { filename: "dsc08434.webp", url: photo35.url },
  { filename: "dsc08473.webp", url: photo36.url },
  { filename: "dsc08628.webp", url: photo37.url },
  { filename: "dsc08644.webp", url: photo38.url },
  { filename: "dsc08647.webp", url: photo39.url },
  { filename: "dsc08687.webp", url: photo40.url },
  { filename: "dsc08710.webp", url: photo41.url },
  { filename: "dsc08836.webp", url: photo42.url },
  { filename: "dsc08875.webp", url: photo43.url },
  { filename: "dsc08880.webp", url: photo44.url },
  { filename: "dsc08917.webp", url: photo45.url },
  { filename: "dsc09203.webp", url: photo46.url },
  { filename: "dsc09234.webp", url: photo47.url },
  { filename: "dsc09255.webp", url: photo48.url },
  { filename: "dsc09296.webp", url: photo49.url },
  { filename: "dsc09433.webp", url: photo50.url },
  { filename: "img-20241010-wa0104.webp", url: photo51.url },
  { filename: "img_1176.webp", url: photo52.url },
  { filename: "img_5147.webp", url: photo53.url },
];

export const galleryItems: AccordionGalleryItem[] = photos.map((photo, index) => ({
  image: photo.url,
  alt: `${galleryCopy.photoAlt} · ${index + 1}`,
}));

export const homeGalleryItems: AccordionGalleryItem[] = galleryCopy.highlights.flatMap((highlight) => {
  const photo = photos.find((item) => item.filename === highlight.filename);
  return photo ? [{ image: photo.url, label: highlight.label, alt: highlight.alt }] : [];
});
