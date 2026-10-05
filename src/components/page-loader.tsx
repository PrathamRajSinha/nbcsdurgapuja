import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function PageLoader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  const [phase, setPhase] = useState<"idle" | "on" | "leaving">("idle");

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setPhase("on");
    const t1 = window.setTimeout(() => setPhase("leaving"), 650);
    const t2 = window.setTimeout(() => setPhase("idle"), 1500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [path]);

  return (
    <div
      className={`page-loader ${phase === "on" ? "is-on" : phase === "leaving" ? "is-leaving" : ""}`}
      aria-hidden="true"
    >
      <img src={logoAsset.url} alt="" />
    </div>
  );
}

export function LogoSpinner() {
  return <img className="logo-spinner" src={logoAsset.url} alt="" />;
}
