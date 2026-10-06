import { useEffect, useRef, useState } from "react";

type ParsedValue = { target: number; suffix: string };

function parseValue(value: string): ParsedValue | null {
  const match = value.trim().match(/^([\d,]+)\s*(.*)$/);
  if (!match) return null;
  const target = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;
  return { target, suffix: match[2] };
}

export function CountUp({ value }: { value: string }) {
  const parsed = parseValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => (parsed ? "0" : value));

  useEffect(() => {
    const parsed = parseValue(value);
    if (!parsed) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const { target, suffix } = parsed;
    let frame = 0;
    const run = () => {
      const start = performance.now();
      const duration = 1800;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(`${Math.round(target * eased).toLocaleString("en-IN")}${suffix}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
  return <span ref={ref}>{display}</span>;
}
