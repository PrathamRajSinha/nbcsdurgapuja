import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import introAsset from "@/assets/intro-dancer.mp4.asset.json";
import logoAsset from "@/assets/logo.png.asset.json";

/** Opening video (with sound) shown once per session, then curtains open to reveal the site. */
export function IntroReveal() {
  const [phase, setPhase] = useState<"pending" | "hidden" | "playing" | "leaving">("pending");
  const [muted, setMuted] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("nbcs-intro") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("hidden"); return; }
    sessionStorage.setItem("nbcs-intro", "1");
    setPhase("playing");
    document.body.classList.add("menu-is-open");
  }, []);

  // Try to play with sound; browsers may block that until the visitor interacts, so fall back to muted.
  useEffect(() => {
    const video = videoRef.current;
    if (phase !== "playing" || !video) return;
    video.muted = false;
    // Browser blocked sound: wait for one tap so the video plays from the start with sound.
    video.play().catch(() => setNeedsTap(true));
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    document.body.classList.remove("menu-is-open");
    const v = videoRef.current;
    if (v) v.pause();
    const t = window.setTimeout(() => setPhase("hidden"), 1300);
    return () => window.clearTimeout(t);
  }, [phase]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) video.play().catch(() => {});
  };

  const startWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    setNeedsTap(false);
    video.muted = false;
    setMuted(false);
    video.currentTime = 0;
    video.play().catch(() => setPhase("leaving"));
  };

  if (phase === "hidden") return null;
  if (phase === "pending") return <div className="intro-reveal"><div className="intro-curtain intro-curtain-left" /><div className="intro-curtain intro-curtain-right" /></div>;
  return (
    <div className={`intro-reveal ${phase === "leaving" ? "is-leaving" : ""}`}>
      <div className="intro-curtain intro-curtain-left" />
      <div className="intro-curtain intro-curtain-right" />
      <div className="intro-stage">
        <video ref={videoRef} src={introAsset.url} playsInline preload="auto" onEnded={() => setPhase("leaving")} onError={() => setPhase("leaving")} />
        <img className="intro-logo" src={logoAsset.url} alt="" />
      </div>
      <button type="button" className="intro-sound" onClick={toggleSound} aria-label={muted ? "Turn sound on" : "Mute sound"}>
        {muted ? <VolumeX /> : <Volume2 />}<span>{muted ? "Sound on" : "Mute"}</span>
      </button>
      {needsTap && (
        <button type="button" className="intro-tap" onClick={startWithSound}>
          <Volume2 /><span>Tap to begin</span>
        </button>
      )}
      <button type="button" className="intro-skip" onClick={() => setPhase("leaving")}>Skip intro</button>
    </div>
  );
}
