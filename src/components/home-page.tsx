import { ArrowDown, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { durgaPujaVenue, festivalDates, impact } from "@/lib/site-content";
import durgaAsset from "@/assets/durga.png.asset.json";
import { DancerBorder, FallingPetals, HeroArtwork, LotusAccent } from "./festival-art";
import { PageShell } from "./site-chrome";
import { DurgaPujaJourney } from "./durga-puja-journey";

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
            <div><MapPin /><span>{durgaPujaVenue.name}, Mahalakshmipuram</span></div>
            <p>Join us for the 49th year celebration of Shri Shri Sharodiya Durga Puja—six days of festivities and cultural programmes.</p>
            <Button variant="festival" size="xl" asChild><a href="/durga-puja">Explore Durga Puja <ArrowRight /></a></Button>
          </div>
          <DancerBorder className="puja-dancers" />
        </section>

        <DurgaPujaJourney />

        <section className="programme-section">
          <div className="programme-heading"><p className="eyebrow">Festival calendar</p><h2>Sacred days,<br />shared moments.</h2></div>
          <div className="event-list">
            {festivalDates.map((event) => <a href="/events" key={event.title}><time>{event.date}</time><h3>{event.title}</h3><p>{event.note}</p><ArrowRight /></a>)}
          </div>
        </section>

        <section className="impact-section">
          <p className="eyebrow">Last celebration, in numbers</p>
          <div className="impact-grid">{impact.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
          <p className="impact-note">A celebration made possible by thousands of neighbours, volunteers, artists and well-wishers.</p>
        </section>

        <section className="kali-teaser">
          <LotusAccent />
          <div><p className="eyebrow">A deeper devotion</p><h2>Kali Bari</h2><p>Visit Kali Mandir at FTI Colony, Nandini Layout for Lakshmi, Shyama, Jagadhatri and Saraswati Puja.</p><Button variant="gold" size="xl" asChild><a href="/kali-bari">Visit Kali Bari <ArrowRight /></a></Button></div>
        </section>

        <section className="donation-section" id="donate">
          <p className="eyebrow">Keep the tradition flowing</p>
          <h2>Every offering becomes<br /><em>a shared celebration.</em></h2>
          <p>Your support helps NBCS bring culture and community together. The secure donation link will be available soon.</p>
          <Button variant="donate" size="xl" disabled>Donation link coming soon</Button>
        </section>
      </main>
    </PageShell>
  );
}