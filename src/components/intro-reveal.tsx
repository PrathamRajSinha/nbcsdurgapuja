import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import introAsset from "@/assets/intro-dancer.mp4.asset.json";
import logoAsset from "@/assets/logo.png.asset.json";

/** Seconds into the intro clip where its motion and sound end (measured; after this it's a still, silent frame). */
const INTRO_CONTENT_END_S = 10.25;

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
    // Browser blocked sound: fall back to muted autoplay so the video still runs and the curtains open on their own.
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => setNeedsTap(true));
    });
  }, [phase]);

  // The clip's motion and sound stop at ~10.2s (the rest is a frozen, silent frame), so open the curtains there.
  const contentEnd = (video: HTMLVideoElement) =>
    Math.min(INTRO_CONTENT_END_S, Number.isFinite(video.duration) ? video.duration : INTRO_CONTENT_END_S);

  // Safety net: if playback stalls, open the curtains shortly after the content should have finished.
  const armAutoOpen = () => {
    const video = videoRef.current;
    if (!video) return;
    window.setTimeout(() => setPhase((p) => (p === "playing" ? "leaving" : p)), contentEnd(video) * 1000 + 1500);
  };

  const checkContentEnd = () => {
    const video = videoRef.current;
    if (video && video.currentTime >= contentEnd(video)) setPhase((p) => (p === "playing" ? "leaving" : p));
  };

  // Poll every frame while playing so the curtains open right as the motion stops (timeupdate is too coarse).
  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    const tick = () => { checkContentEnd(); raf = window.requestAnimationFrame(tick); };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    document.body.classList.remove("menu-is-open");
    const v = videoRef.current;
    if (v) v.pause();
    const t = window.setTimeout(() => setPhase("hidden"), 950);
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
  if (phase === "pending") return <div className="intro-reveal"><div className="intro-curtain intro-curtain-left" /><div className="intro-curtain intro-curtain-right" /><img className="logo-spinner intro-wait-logo" src={logoAsset.url} alt="" /></div>;
  return (
    <div className={`intro-reveal ${phase === "leaving" ? "is-leaving" : ""}`}>
      <div className="intro-curtain intro-curtain-left" />
      <div className="intro-curtain intro-curtain-right" />
      <div className="intro-stage">
        <video ref={videoRef} src={introAsset.url} playsInline preload="auto" onLoadedMetadata={armAutoOpen} onEnded={() => setPhase("leaving")} onError={() => setPhase("leaving")} />
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
