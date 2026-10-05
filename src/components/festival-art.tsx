import durgaAsset from "@/assets/durga.png.asset.json";
import lotusAsset from "@/assets/lotus.png.asset.json";
import lotusLeafAsset from "@/assets/lotus-with-leaf.png.asset.json";
import longWaterAsset from "@/assets/long-water.png.asset.json";
import type { CSSProperties } from "react";

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
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="sun-disc" />
      <div className="alpana alpana-one">✺</div>
      <div className="alpana alpana-two">✦</div>
      <img className="hero-lotus" src={lotusLeafAsset.url} alt="" />
      <img className="hero-durga" src={durgaAsset.url} alt="" />
      <img className="hero-water" src={longWaterAsset.url} alt="" />
    </div>
  );
}

export function WaterDivider({ flip = false }: { flip?: boolean }) {
  return <img className={flip ? "water-divider -scale-x-100" : "water-divider"} src={longWaterAsset.url} alt="" aria-hidden="true" />;
}

export function LotusAccent({ className = "" }: { className?: string }) {
  return <img className={`lotus-accent ${className}`} src={lotusLeafAsset.url} alt="" aria-hidden="true" />;
}