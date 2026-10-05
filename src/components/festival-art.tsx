import durgaAsset from "@/assets/durga.png.asset.json";
import lotusAsset from "@/assets/lotus.png.asset.json";
import lotusLeafAsset from "@/assets/lotus-with-leaf.png.asset.json";
import longWaterAsset from "@/assets/long-water.png.asset.json";
import waterAsset from "@/assets/water.png.asset.json";
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
      <WaterRibbon className="hero-water" />
    </div>
  );
}

export function WaterDivider({ flip = false }: { flip?: boolean }) {
  return <WaterRibbon className={flip ? "water-divider is-reversed" : "water-divider"} />;
}

export function WaterRibbon({ className = "" }: { className?: string }) {
  const images = Array.from({ length: 8 }, (_, index) => index % 2 === 0 ? longWaterAsset : waterAsset);
  return (
    <div className={`water-ribbon ${className}`} aria-hidden="true">
      <div className="water-ribbon-track">
        {images.map((asset, index) => (
          <img key={`${asset.asset_id}-${index}`} className={index % 3 !== 0 ? "is-flipped" : ""} src={asset.url} alt="" />
        ))}
      </div>
    </div>
  );
}

export function LotusAccent({ className = "" }: { className?: string }) {
  return <img className={`lotus-accent ${className}`} src={lotusLeafAsset.url} alt="" aria-hidden="true" />;
}