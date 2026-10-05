"use client";

import { useEffect, useRef } from "react";
import { durgaPujaSchedule } from "@/lib/site-content";

function setRevealOrigin(event: React.PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const diameter = 2 * Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  );

  card.style.setProperty("--reveal-x", `${x}px`);
  card.style.setProperty("--reveal-y", `${y}px`);
  card.style.setProperty("--reveal-size", `${Math.ceil(diameter)}px`);
}

function parseScheduleLine(detail: string) {
  const match = detail.match(/^(\d{1,2}:\d{2} [AP]M(?: onwards)?(?: — \d{1,2}:\d{2} [AP]M(?: onwards)?)?) — (.+)$/);
  return match ? { time: match[1], event: match[2] } : { time: "", event: detail };
}

export function DurgaPujaJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!(section && viewport && track)) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const horizontalRange = Math.max(track.scrollWidth - viewport.clientWidth, 0);
      section.style.setProperty("--journey-distance", `${horizontalRange}px`);
      const sectionRect = section.getBoundingClientRect();
      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-sectionRect.top / scrollRange, 0), 1);
      track.style.transform = `translate3d(${-progress * horizontalRange}px, 0, 0)`;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(track);
    resizeObserver.observe(viewport);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section className="journey-section" ref={sectionRef}>
      <div className="journey-sticky">
        <div className="journey-heading">
          <div className="section-kicker"><span>02</span><p>16 — 21 October 2026</p></div>
          <h2>Six sacred days.<br /><em>One celebration.</em></h2>
          <p className="journey-scroll-note">Scroll to explore</p>
        </div>
        <div className="journey-viewport" ref={viewportRef}>
          <div className="journey-track" ref={trackRef}>
            {durgaPujaSchedule.map((day, index) => {
              const [name, date = ""] = day.title.split(" · ");
              const [weekday = "", ...details] = day.copy.split("\n");
              return (
                <article
                  className="journey-card"
                  key={day.title}
                  onPointerEnter={setRevealOrigin}
                  onPointerMove={setRevealOrigin}
                >
                  <span className="journey-card-number">0{index + 1}</span>
                  <div className="journey-card-date"><strong>{date.split(" ")[0]}</strong><span>October</span></div>
                  <p className="journey-card-weekday">{weekday}</p>
                  <h3>{name}</h3>
                  <div className="journey-card-events">
                    {details.map((detail) => {
                      const { time, event } = parseScheduleLine(detail);
                      return <p key={detail}>{time && <time>{time}</time>}<span>{event}</span></p>;
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}