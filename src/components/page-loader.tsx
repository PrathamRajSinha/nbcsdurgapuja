import { useEffect, useRef, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

const COVER_MS = 480;

export function PageLoader() {
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  const covering = useRef(false);
  const [phase, setPhase] = useState<"idle" | "on" | "leaving">("idle");

  // Cover the screen BEFORE navigating, so the next page is never seen early.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      if (covering.current) return;
      covering.current = true;
      setPhase("on");
      window.setTimeout(() => {
        router.navigate({ href: url.pathname + url.search + url.hash });
      }, COVER_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const wasCovered = covering.current;
    covering.current = false;
    setPhase("on");
    window.scrollTo(0, 0);
    const hold = wasCovered ? 350 : 650;
    const t1 = window.setTimeout(() => setPhase("leaving"), hold);
    const t2 = window.setTimeout(() => setPhase("idle"), hold + 850);
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
