import durgaAsset from "@/assets/durga.png.asset.json";
import dancersAsset from "@/assets/dhunuchi-dancers.png.asset.json";
import lotusAsset from "@/assets/lotus.png.asset.json";
import lotusLeafAsset from "@/assets/lotus-with-leaf.png.asset.json";
import { useEffect, useRef, type CSSProperties } from "react";

export function FallingPetals() {
  return (
    <div className="petal-field" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          style={{
            "--petal": index,
            "--petal-x": `${(index * 17 + 7) % 96}%`,
            "--petal-size": `${20 + (index % 4) * 9}px`,
            "--petal-opacity": 0.25 + (index % 4) * 0.12,
            "--petal-duration": `${11 + (index % 5) * 2}s`,
          } as CSSProperties}
        >
          <img src={lotusAsset.url} alt="" />
        </span>
      ))}
    </div>
  );
}

export function HeroArtwork() {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = artRef.current;
    const hero = art?.closest(".festival-hero");
    if (!art || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const move = (event: Event) => {
      const pointer = event as PointerEvent;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = ((pointer.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((pointer.clientY - bounds.top) / bounds.height - 0.5) * 2;
        art.style.setProperty("--pointer-x", x.toFixed(3));
        art.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };
    const reset = () => {
      art.style.setProperty("--pointer-x", "0");
      art.style.setProperty("--pointer-y", "0");
    };

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div ref={artRef} className="hero-art" aria-hidden="true">
      <div className="sun-disc" />
      <div className="alpana alpana-one">✺</div>
      <div className="alpana alpana-two">✦</div>
      <div className="hero-lotus-layer"><img className="hero-lotus" src={lotusLeafAsset.url} alt="" /></div>
      <div className="hero-durga-layer"><img className="hero-durga" src={durgaAsset.url} alt="" /></div>
      <DancerBorder className="hero-dancers" />
    </div>
  );
}

export function DancerBorder({ className = "" }: { className?: string }) {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const border = borderRef.current;
    if (!border || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        border.style.setProperty("--dancer-x", `${window.scrollY * 0.14}px`);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      ref={borderRef}
      className={`dancer-border ${className}`}
      style={{ "--dancer-art": `url(${dancersAsset.url})` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

export function LotusBorder({ className = "" }: { className?: string }) {
  const flowers = Array.from({ length: 13 }, (_, index) => ({
    asset: index % 3 === 1 ? lotusLeafAsset : lotusAsset,
    size: 68 + ((index * 19) % 58),
    offset: -22 + ((index * 23) % 29),
    rotation: -20 + ((index * 29) % 43),
    duration: 4.6 + (index % 5) * 0.7,
    delay: -(index % 6) * 0.8,
  }));

  return (
    <div className={`lotus-border ${className}`} aria-hidden="true">
      {flowers.map((flower, index) => (
        <span
          key={`${flower.asset.asset_id}-${index}`}
          style={{
            "--lotus-size": `${flower.size}px`,
            "--lotus-offset": `${flower.offset}px`,
            "--lotus-rotation": `${flower.rotation}deg`,
            "--lotus-duration": `${flower.duration}s`,
            "--lotus-delay": `${flower.delay}s`,
          } as CSSProperties}
        >
          <img src={flower.asset.url} alt="" />
        </span>
      ))}
    </div>
  );
}

export function LotusAccent({ className = "" }: { className?: string }) {
  return <img className={`lotus-accent ${className}`} src={lotusLeafAsset.url} alt="" aria-hidden="true" />;
}