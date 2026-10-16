"use client";

import { Apple, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusChip } from "@/components/ui/StatusChip";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { IntegrationTile } from "@/components/ui/IntegrationTile";
import { TrustStrip } from "@/components/ui/TrustStrip";
import { FaqItem } from "@/components/ui/FaqItem";
import { Counter } from "@/components/ui/Counter";
import { ChatBubbleYou } from "@/components/demo/ChatBubbleYou";
import { ChatBubbleJuno } from "@/components/demo/ChatBubbleJuno";
import { OutputCard } from "@/components/demo/OutputCard";
import { ApprovalPrompt } from "@/components/demo/ApprovalPrompt";
import { NotificationCard } from "@/components/demo/NotificationCard";
import { Mascot, type MascotState } from "@/components/mascot/Mascot";
import { connectedTools, notifications } from "@/lib/story";

const states: MascotState[] = ["sleeping", "waking", "idle", "glancing", "thinking", "checking", "calm"];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12">
      <p className="t-eyebrow mb-6 text-muted">{title}</p>
      {children}
    </section>
  );
}

export function KitView() {
  return (
    <main id="main" className="container-page pb-24 pt-32">
      <h1 className="t-display-l mb-12">Component kit</h1>
      <Block title="Type">
        <p className="t-display-xl">Display XL</p>
        <p className="t-display-l">Display L <span className="text-muted">muted</span></p>
        <p className="t-h2">H2 sub-headline</p>
        <p className="t-h3">H3 card title</p>
        <p className="t-body-l text-muted">Body L subhead</p>
        <p className="t-body">Body paragraph</p>
        <Eyebrow dot>EYEBROW</Eyebrow>
      </Block>
      <Block title="Buttons and links">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">Get Juno</Button>
          <Button>Get Juno</Button>
          <Button variant="secondary" icon={<Apple size={18} strokeWidth={1.5} aria-hidden />}>Download for Mac</Button>
          <TextLink href="#">See how it works</TextLink>
        </div>
      </Block>
      <Block title="Status chips">
        <div className="flex flex-wrap gap-2">
          {(["Draft", "Needs you", "Scheduled", "Sent", "Shipped", "Done"] as const).map((s) => <StatusChip key={s} status={s} />)}
        </div>
      </Block>
      <Block title="Mascot states">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {states.map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <Mascot size={96} state={s} />
              <span className="font-mono text-[12px] text-muted">{s}</span>
            </div>
          ))}
        </div>
      </Block>
      <Block title="Integration tiles">
        <div className="flex flex-wrap gap-3">{connectedTools.map((id) => <IntegrationTile key={id} id={id} />)}</div>
      </Block>
      <Block title="Feature cards">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard><ShieldCheck size={22} strokeWidth={1.5} className="mb-6 text-muted" aria-hidden /><h3 className="t-h3">Tilt card</h3><p className="mt-2 text-muted">Hover to tilt, max 4 degrees.</p></FeatureCard>
          <FeatureCard><h3 className="t-h3">Second card</h3><p className="mt-2 text-muted">Border brightens on hover.</p></FeatureCard>
          <FeatureCard dashed><h3 className="t-h3">Placeholder card</h3><p className="mt-2 text-muted">Dashed border.</p></FeatureCard>
        </div>
      </Block>
      <Block title="Demo formula">
        <div className="max-w-[640px] space-y-5">
          <ChatBubbleYou>Draft release notes for Scheduled Reports.</ChatBubbleYou>
          <ChatBubbleJuno>I drafted them from the SR tickets in Linear. Want me to post them to #launch?</ChatBubbleJuno>
          <OutputCard tool="slack" title="Slack post · #launch" chip={<StatusChip status="Draft" />}>
            <p className="text-[14px] text-text/90">Scheduled Reports is live. Send any dashboard on a schedule.</p>
          </OutputCard>
          <ApprovalPrompt question="Post to #launch?" />
        </div>
      </Block>
      <Block title="Notification card">
        <NotificationCard n={notifications[0]} />
      </Block>
      <Block title="Counter">
        <p className="t-display-l"><Counter value={46} /></p>
      </Block>
      <Block title="FAQ item">
        <FaqItem q="Does it act without asking?" a="No. In Ask mode Juno checks with you first." />
      </Block>
      <Block title="Trust strip">
        <TrustStrip />
      </Block>
    </main>
  );
}
