import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function PageLoader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 650);
    return () => window.clearTimeout(t);
  }, [path]);

  return (
    <div className={`page-loader ${show ? "is-on" : ""}`} aria-hidden="true">
      <img src={logoAsset.url} alt="" />
    </div>
  );
}

export function LogoSpinner() {
  return <img className="logo-spinner" src={logoAsset.url} alt="" />;
}
