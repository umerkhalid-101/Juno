"use client";

import { useRef, type ComponentType } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { TextLink } from "@/components/ui/TextLink";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { chapters, feature, type FeatureId } from "@/lib/features";
import { Anatomy, FeatureIcon, SectionHead, Stage } from "./kit";
import { AppArtifact, CmsArtifact, MediaArtifact, SiteArtifact } from "./makesArtifacts";

/**
 * Chapter 3: things you can hold. Four big cards, each one sliding up over the last while the
 * one underneath settles back and dims. Each artifact plays when its card reaches the top.
 */

// soft hues, one per artifact
const hues = ["#C9B8FF", "#E8C9A0", "#A6BBFF", "#F2B8A8"];

const cards: { id: FeatureId; Artifact: ComponentType<{ on: boolean }> }[] = [
  { id: "app-builder", Artifact: AppArtifact },
  { id: "website-builder", Artifact: SiteArtifact },
  { id: "built-in-cms", Artifact: CmsArtifact },
  { id: "image-and-video", Artifact: MediaArtifact },
];

function Card({ i }: { i: number }) {
  const { id, Artifact } = cards[i];
  const f = feature(id);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.65 });
  return (
    <article
      ref={ref}
      id={id}
      className={`mk-inner relative flex origin-top scroll-mt-28 flex-col overflow-hidden rounded-[28px] border border-line bg-surface shadow-[var(--shadow-frame)] ${"md:h-[min(600px,calc(100vh-150px))] md:min-h-[520px]"}`}
    >
      {/* the feature, and what you asked for */}
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-line bg-surface-2 px-5 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <FeatureIcon f={f} size={36} />
          <h2 className="text-[20px] font-medium tracking-[-0.015em] text-[#A6BBFF] md:text-[22px]">{f.name}</h2>
        </div>
        <span className="rounded-[14px] rounded-br-[5px] bg-white/[0.07] px-4 py-2 text-[14px] text-text md:text-[15px]">
          {chapters.makes.requests[id]}
        </span>
      </header>
      <div className="grid min-h-0 flex-1 md:grid-cols-12">
        <Anatomy f={f} bare className="p-6 md:col-span-4 md:self-center md:p-10">
          {id === "app-builder" && (
            <div className="mt-5">
              <TextLink href="/#apps">See the app builder</TextLink>
            </div>
          )}
        </Anatomy>
        {/* the artifact, on a soft stage that runs to the card's edges */}
        <div className="h-[400px] min-h-0 md:col-span-8 md:h-auto">
          <Stage
            color={hues[i]}
            from="100% 0%"
            className="h-full !rounded-none !border-0 md:!border-l md:!border-white/[0.06]"
            inset="px-5 pt-5 md:px-8 md:pt-8"
          >
            <Artifact on={Boolean(seen || reduce)} />
          </Stage>
        </div>
      </div>
      {/* dims as the next card covers it */}
      <span aria-hidden className="mk-dim pointer-events-none absolute inset-0 bg-bg opacity-0" />
    </article>
  );
}

export function FxMakes() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const wraps = gsap.utils.toArray<HTMLElement>(".mk-wrap", root.current);
        wraps.forEach((w, i) => {
          const next = wraps[i + 1];
          if (!next) return;
          const tl = gsap.timeline({
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 96px", scrub: true },
          });
          tl.to(w.querySelector(".mk-inner"), { scale: 0.94, ease: "none" }, 0);
          tl.to(w.querySelector(".mk-dim"), { opacity: 0.4, ease: "none" }, 0);
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="makes"
      aria-labelledby="makes-title"
      className="relative scroll-mt-24 py-24 md:py-40"
    >
      <div className="container-page">
        <SectionHead
          id="makes-title"
          title={chapters.makes.title}
          muted={chapters.makes.muted}
          sub={chapters.makes.sub}
        />
        <div className="mt-16 flex flex-col gap-8 md:mt-24 md:gap-[12vh]">
          {cards.map((c, i) => (
            <div key={c.id} className="mk-wrap md:sticky md:top-24" style={{ zIndex: i + 1 }}>
              <Card i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
