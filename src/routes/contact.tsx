import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/inner-page";
import { durgaPujaVenue, kaliMandir, placeholderContact } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Contact | NBCS" },
    { name: "description", content: "Contact North Bangalore Cultural Samithi and find our 2026 puja venues." },
    { property: "og:title", content: "Contact | NBCS" },
    { property: "og:description", content: "Official NBCS addresses, phone numbers, email and web links." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <InnerPage label="North Bangalore Cultural Samithi" title="Come celebrate with us" lead="We invite you and your family to join our festivities." blocks={[
    { title: "Durga Puja venue", copy: `${durgaPujaVenue.name}\n${durgaPujaVenue.address}\n${durgaPujaVenue.locationUrl}` },
    { title: "Kali Mandir", copy: `${kaliMandir.address}\n${kaliMandir.locationUrl}` },
    { title: "Call", copy: placeholderContact.phone },
    { title: "Email", copy: placeholderContact.email },
    { title: "Facebook", copy: placeholderContact.facebook },
    { title: "Instagram", copy: placeholderContact.instagram },
    { title: "Website", copy: placeholderContact.website },
  ]} />,
});