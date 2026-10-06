import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Facebook, Globe, Heart, IdCard, Instagram, Landmark, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { footerLinks, madeBy, membershipForm, navItems, type FooterLink } from "@/lib/site-content";
import logoAsset from "@/assets/logo.png.asset.json";
import dutalyAsset from "@/assets/dutaly-pages.png.asset.json";

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
        <Button variant="gold" size="sm" asChild>
          <a href={membershipForm.url} target="_blank" rel="noopener noreferrer">
            <IdCard />
            <span className="label-wide">{membershipForm.label}</span>
            <span className="label-narrow">{membershipForm.shortLabel}</span>
          </a>
        </Button>
        <Button variant="donate" size="sm" asChild><a href="#donate"><Heart /> Donate</a></Button>
        <Button variant="navIcon" size="icon" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {mounted && createPortal(
        <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
          <nav aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <Link key={item.href} to={item.href} style={{ "--d": index * 0.04 } as CSSProperties} onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
            <a href={membershipForm.url} target="_blank" rel="noopener noreferrer" style={{ "--d": navItems.length * 0.04 } as CSSProperties}>{membershipForm.label} <ArrowUpRight /></a>
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

const footerIcons = {
  facebook: Facebook,
  instagram: Instagram,
  globe: Globe,
  pin: MapPin,
  temple: Landmark,
  member: IdCard,
  mail: Mail,
  phone: Phone,
} as const;

function FooterLinkList({ links, className }: { links: FooterLink[]; className: string }) {
  return (
    <div className={className}>
      {links.map((link) => {
        const Icon = footerIcons[link.icon];
        const external = link.href.startsWith("http");
        return (
          <a key={link.href} href={link.href}{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <Icon />
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}

export function SiteFooter() {
  const contactLinks = footerLinks.filter((link) => link.wide);
  const connectLinks = footerLinks.filter((link) => !link.wide);
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand"><img src={logoAsset.url} alt="NBCS emblem" /><p>North Bangalore<br />Cultural Samithi</p>
          <FooterLinkList className="footer-contact" links={contactLinks} />
        </div>
        <div><p className="eyebrow">Durga Puja & Kali Bari</p><h2>Culture flows<br />through community.</h2>
          <FooterLinkList className="footer-social" links={connectLinks} />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} North Bangalore Cultural Samithi</span>
        <a className="footer-madeby" href={madeBy.url} target="_blank" rel="noopener noreferrer">
          <span>{madeBy.label}</span>
          <img src={dutalyAsset.url} alt="Dutaly Pages" />
        </a>
      </div>
    </footer>
  );
}