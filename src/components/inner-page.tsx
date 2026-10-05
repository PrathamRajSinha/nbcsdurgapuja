import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "./site-chrome";
import { DancerBorder, FallingPetals } from "./festival-art";

type PageBlock = { title: string; copy: string };

export function InnerPage({ label, title, lead, blocks, action }: { label: string; title: string; lead: string; blocks: PageBlock[]; action?: string }) {
  return (
    <PageShell>
      <main className="inner-page">
        <FallingPetals />
        <p className="eyebrow page-label">{label}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <div className="placeholder-band">
          {blocks.map((block) => <article key={block.title}><h2>{block.title}</h2><p>{block.copy}</p></article>)}
        </div>
        {action && <Button variant="festival" size="xl" disabled className="mt-10">{action} <ArrowRight /></Button>}
        <DancerBorder />
      </main>
    </PageShell>
  );
}