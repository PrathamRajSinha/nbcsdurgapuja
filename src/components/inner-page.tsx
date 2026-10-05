import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PageShell } from "./site-chrome";
import logoAsset from "@/assets/logo.png.asset.json";
import { DancerBorder, FallingPetals } from "./festival-art";

type PageBlock = { title: string; copy: string };

const WEEKDAY = /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i;
const MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i;
const LEADING_TIME =
  /^\s*(\d{1,2}:\d{2}\s*[AP]M(?:\s+onwards)?(?:\s*[—–-]\s*\d{1,2}:\d{2}\s*[AP]M(?:\s+onwards)?)?)\s*(?:[—–-]\s*(.*))?$/i;
const TIME_TEXT = /\d{1,2}:\d{2}\s*[AP]M(?:\s+onwards)?/gi;

function boldTimes(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TIME_TEXT)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(<strong key={start}>{match[0]}</strong>);
    last = start + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function BlockLine({ line }: { line: string }) {
  const timed = line.match(LEADING_TIME);
  if (timed) {
    return (
      <p className="band-event">
        <strong>{timed[1]}</strong>
        {timed[2] ? <span>{timed[2]}</span> : null}
      </p>
    );
  }
  if (WEEKDAY.test(line) || MONTH.test(line)) {
    return <p className="band-date">{boldTimes(line)}</p>;
  }
  return <p className="band-note">{line}</p>;
}

export function InnerPage({ label, title, lead, blocks, action }: { label: string; title: string; lead: string; blocks: PageBlock[]; action?: string }) {
  return (
    <PageShell>
      <main className="inner-page">
        <FallingPetals />
        <img className="page-watermark" src={logoAsset.url} alt="" aria-hidden="true" />
        <p className="eyebrow page-label">{label}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <div className="placeholder-band">
          {blocks.map((block) => (
            <article key={block.title}>
              <h2>{block.title}</h2>
              <div className="band-body">
                {block.copy.split("\n").map((line, index) => (
                  <BlockLine key={`${block.title}-${index}`} line={line} />
                ))}
              </div>
            </article>
          ))}
        </div>
        {action && <Button variant="festival" size="xl" disabled className="mt-10">{action} <ArrowRight /></Button>}
        <DancerBorder />
      </main>
    </PageShell>
  );
}
