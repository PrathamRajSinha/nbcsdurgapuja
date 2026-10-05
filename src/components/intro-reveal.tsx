import { useEffect, useState } from "react";
import introAsset from "@/assets/intro-dancer.mp4.asset.json";
import logoAsset from "@/assets/logo.png.asset.json";

/** Opening video shown once per session, then curtains open to reveal the site. */
export function IntroReveal() {
  const [phase, setPhase] = useState<"hidden" | "playing" | "leaving">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem("nbcs-intro") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sessionStorage.setItem("nbcs-intro", "1");
    setPhase("playing");
    document.body.classList.add("menu-is-open");
    const fallback = window.setTimeout(() => setPhase("leaving"), 11000);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    document.body.classList.remove("menu-is-open");
    const t = window.setTimeout(() => setPhase("hidden"), 1300);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "hidden") return null;
  return (
    <div className={`intro-reveal ${phase === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
      <div className="intro-curtain intro-curtain-left" />
      <div className="intro-curtain intro-curtain-right" />
      <div className="intro-stage">
        <video src={introAsset.url} autoPlay muted playsInline onEnded={() => setPhase("leaving")} />
        <img className="intro-logo" src={logoAsset.url} alt="" />
      </div>
      <button type="button" className="intro-skip" onClick={() => setPhase("leaving")}>Skip intro</button>
    </div>
  );
}
