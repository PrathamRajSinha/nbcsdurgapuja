import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, Menu, X } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { navItems, placeholderContact } from "@/lib/site-content";
import logoAsset from "@/assets/logo.png.asset.json";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.classList.add("menu-is-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-is-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <Link to="/" className="brand-lockup" aria-label="NBCS home">
        <span className="brand-emblem"><img src={logoAsset.url} alt="NBCS emblem" /></span>
        <span className="brand-text"><strong>NBCS</strong><small>49th year · Bengaluru</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.slice(0, 7).map((item) => (
          <Link key={item.href} to={item.href} activeOptions={{ exact: item.href === "/" }} activeProps={{ className: "is-active" }}>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Button variant="donate" size="lg" asChild><a href="#donate"><Heart /> Donate</a></Button>
        <Button variant="navIcon" size="icon" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {mounted && createPortal(
        <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
          <nav aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <Link key={item.href} to={item.href} style={{ "--d": index * 0.04 } as CSSProperties} onClick={() => setOpen(false)}><small>0{index + 1}</small>{item.label}</Link>
            ))}
          </nav>
          <p><img className="menu-logo" src={logoAsset.url} alt="" />North Bangalore Cultural Samithi<br />Durga Puja & Kali Bari</p>
        </div>,
        document.body,
      )}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <><SiteHeader />{children}<SiteFooter /></>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand"><img src={logoAsset.url} alt="NBCS emblem" /><p>North Bangalore<br />Cultural Samithi</p></div>
        <div><p className="eyebrow">Durga Puja & Kali Bari</p><h2>Culture flows<br />through community.</h2></div>
        <div className="footer-links">{navItems.map((item) => <Link key={item.href} to={item.href}>{item.label}<ArrowUpRight /></Link>)}</div>
      </div>
      <div className="footer-bottom"><a href={`mailto:${placeholderContact.email}`}>{placeholderContact.email}</a><span>© NBCS</span></div>
    </footer>
  );
}