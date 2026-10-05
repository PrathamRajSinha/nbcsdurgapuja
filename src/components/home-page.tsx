import { ArrowDown, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { festivalDates, impact, pujaJourney } from "@/lib/site-content";
import durgaAsset from "@/assets/durga.png.asset.json";
import { FallingPetals, HeroArtwork, LotusAccent, WaterDivider, WaterRibbon } from "./festival-art";
import { PageShell } from "./site-chrome";

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
              <a className="text-link" href="#story">Discover our story <ArrowDown /></a>
            </div>
          </div>
          <HeroArtwork />
          <p className="hero-side-note">Culture · Community · Celebration</p>
        </section>

        <section className="years-section" id="story">
          <WaterDivider />
          <div className="years-number">49</div>
          <div className="years-copy">
            <p className="eyebrow">Since 48 years of community</p>
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
            <div><CalendarDays /><span>27 September — 2 October 2025</span></div>
            <div><MapPin /><span>[VENUE TO BE ANNOUNCED]</span></div>
            <p>People from every walk of life come together for five days of festivities and cultural celebration.</p>
            <Button variant="festival" size="xl" asChild><a href="/durga-puja">Explore Durga Puja <ArrowRight /></a></Button>
          </div>
          <WaterRibbon className="puja-water" />
        </section>

        <section className="journey-section">
          <div className="section-kicker"><span>02</span><p>The Puja experience</p></div>
          <h2>Come as you are.<br /><em>Leave as one.</em></h2>
          <div className="journey-track">
            {pujaJourney.map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}
          </div>
        </section>

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
          <div><p className="eyebrow">A deeper devotion</p><h2>Kali Bari</h2><p>[KALI BARI INTRODUCTION — CONTENT COMING SOON]</p><Button variant="gold" size="xl" asChild><a href="/kali-bari">Visit Kali Bari <ArrowRight /></a></Button></div>
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