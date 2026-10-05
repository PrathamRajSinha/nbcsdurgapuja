import { useEffect, useRef, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

const COVER_MS = 480;
const READY_TIMEOUT_MS = 6000;

function nextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  });
}

async function waitForPageToBeReady() {
  const fontReady = "fonts" in document ? document.fonts.ready : Promise.resolve();
  const visibleImages = Array.from(document.images).filter((image) => {
    const bounds = image.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight * 1.25;
  });
  const imageReady = Promise.all(
    visibleImages.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        });
      }
      if (typeof image.decode === "function") {
        await image.decode().catch(() => undefined);
      }
    }),
  );

  await Promise.race([
    Promise.all([fontReady, imageReady, nextPaint()]),
    new Promise<void>((resolve) => window.setTimeout(resolve, READY_TIMEOUT_MS)),
  ]);
  await nextPaint();
}

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
    let cancelled = false;
    const wasCovered = covering.current;
    covering.current = false;
    setPhase("on");
    window.scrollTo(0, 0);
    let finishTimer: number | undefined;

    const revealReadyPage = async () => {
      await waitForPageToBeReady();
      if (cancelled) return;
      if (!wasCovered) await new Promise<void>((resolve) => window.setTimeout(resolve, 250));
      if (cancelled) return;
      setPhase("leaving");
      finishTimer = window.setTimeout(() => setPhase("idle"), 850);
    };
    void revealReadyPage();

    return () => {
      cancelled = true;
      if (finishTimer !== undefined) window.clearTimeout(finishTimer);
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
