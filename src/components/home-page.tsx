import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Heart, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { durgaPujaVenue, festivalPride, impact, instagramSection } from "@/lib/site-content";
import durgaAsset from "@/assets/durga.png.asset.json";
import { CloudParallax, DancerBorder, FallingPetals, HeroArtwork, LotusAccent } from "./festival-art";
import { PageShell } from "./site-chrome";
import { CountUp } from "./count-up";
import { DurgaPujaJourney } from "./durga-puja-journey";
import AccordionGallery from "./accordion-gallery";
import { homeGalleryItems } from "@/lib/gallery";

export function HomePage() {
  return (
    <PageShell>
      <main>
        <section className="festival-hero">
          <FallingPetals />
          <div className="hero-copy">
            <p className="eyebrow">North Bangalore Cultural Samithi presents</p>
            <h1><span>49th year</span>Durga Puja</h1>
            <p className="hero-bengali">শারদ উৎসব</p>
            <div className="hero-cta-row">
              <Button variant="festival" size="xl" asChild><a href="/durga-puja">Explore Puja <ArrowRight /></a></Button>
              <Button variant="ink" size="xl" asChild><a href="#story">Discover our story <ArrowDown /></a></Button>
            </div>
          </div>
          <HeroArtwork />
          <p className="hero-side-note">Culture · Community · Celebration</p>
        </section>

        <section className="years-section" id="story">
          <DancerBorder />
          <div className="years-number">49</div>
          <DancerBorder className="years-dancers-low" />
          <div className="years-copy">
            <p className="eyebrow">49th year celebration · 2026</p>
            <h2>Years of culture,<br />community & celebration.</h2>
            <p>North Bangalore Cultural Samithi is a social community rooted in inclusion, peace, harmony and cultural unity.</p>
            <Button variant="ink" asChild><a href="/about">Our story <ArrowRight /></a></Button>
          </div>
          <LotusAccent className="years-lotus" />
        </section>

        <section className="puja-feature">
          <div className="section-kicker"><span>01</span><p>Shri Shri Durga Puja</p></div>
          <div className="puja-title"><p>Five days of devotion,<br />art & togetherness</p><h2>Durga<br />Puja</h2></div>
          <div className="puja-visual"><img src={durgaAsset.url} alt="Traditional illustration of Durga Maa with her lion" /></div>
          <div className="puja-details">
            <div><CalendarDays /><span>16 — 21 October 2026</span></div>
            <a className="puja-venue" href={durgaPujaVenue.locationUrl} target="_blank" rel="noopener noreferrer"><MapPin /><span>{durgaPujaVenue.name}, Mahalakshmipuram</span><ArrowUpRight className="venue-arrow" /></a>
            <p>Join us for the 49th year celebration of Shri Shri Sharodiya Durga Puja—six days of festivities and cultural programmes.</p>
            <Button variant="festival" size="xl" asChild><a href="/durga-puja">Explore Durga Puja <ArrowRight /></a></Button>
          </div>
          <DancerBorder className="puja-dancers" />
        </section>

        <DurgaPujaJourney />

        <section className="calendar-cta-section">
          <p className="eyebrow">Festival calendar</p>
          <Button variant="festival" size="xl" asChild><a href="/events">Festival Calendar <ArrowRight /></a></Button>
        </section>

        <section className="instagram-section">
          <a className="insta-follow" href={instagramSection.profileUrl} target="_blank" rel="noopener noreferrer">Follow us on Insta <Instagram /></a>
          <div className="home-gallery">
            <AccordionGallery items={homeGalleryItems} defaultIndex={2} expandRatio={0.5} height={480} accentColor="var(--gold)" overlayColor="var(--kali)" grayscale={false} />
          </div>
          <Button variant="festival" size="xl" asChild><a href="/gallery">See full gallery <ArrowRight /></a></Button>
        </section>

        <section className="impact-section">
          <CloudParallax />
          <p className="impact-tagline">
            {festivalPride.tagline.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className={index < 3 ? "tag-gold" : "tag-verm"}>{word}{" "}</span>
            ))}
          </p>
          <p className="impact-estd">{festivalPride.established}</p>
          <p className="impact-awards">{festivalPride.awards}</p>
          <p className="eyebrow">Last celebration, in numbers</p>
          <div className="impact-grid">{impact.map((item) => <div key={item.label}><strong><CountUp value={item.value} /></strong><span>{item.label}</span></div>)}</div>
          <p className="impact-note">A celebration made possible by thousands of neighbours, volunteers, artists and well-wishers.</p>
        </section>

        <section className="kali-teaser">
          <LotusAccent />
          <div><p className="eyebrow">A deeper devotion</p><h2>Kali Bari</h2><p>Visit Kali Mandir at FTI Colony, Nandini Layout for Lakshmi, Shyama, Jagadhatri and Saraswati Puja.</p><Button variant="gold" size="xl" asChild><a href="/kali-bari">Visit Kali Bari <ArrowRight /></a></Button></div>
        </section>

        <section className="donation-section" id="donate">
          <p className="eyebrow">Keep the tradition flowing</p>
          <h2>Every offering becomes<br /><em>a shared celebration.</em></h2>
          <p>Your support helps us continue the traditions, celebrations and community that bring North Bangalore together.</p>
          <Button variant="donate" size="xl" asChild><a href="/donate">Donate now <Heart /></a></Button>
        </section>
      </main>
    </PageShell>
  );
}