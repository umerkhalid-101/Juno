import type { Metadata } from "next";
import { AppsHero } from "@/components/apps/AppsHero";
import { Website } from "@/components/apps/Website";
import { Dock } from "@/components/apps/Dock";
import { Bento } from "@/components/apps/Bento";
import { OneMore } from "@/components/apps/OneMore";
import { PageCta } from "@/components/ui/PageCta";
import { FaqConsole } from "@/components/ui/FaqConsole";
import { apps } from "@/lib/apps";

const { title, description } = apps.meta;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/apps" },
  openGraph: { title, description, url: "/apps", siteName: "Juno", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function AppsPage() {
  const f = apps.faq;
  return (
    <main id="main">
      <AppsHero />
      <Website />
      <Dock />
      <Bento />
      <OneMore />
      <section aria-labelledby="faq-title" className="pt-36 md:pt-56">
        <div className="container-page">
          <h2 id="faq-title" className="t-display-l mx-auto max-w-[820px] text-balance text-center">
            {f.title} <span className="accent-text block">{f.muted}</span>
          </h2>
          <FaqConsole items={[...f.items]} />
        </div>
      </section>
      <PageCta
        title={
          <>
            {apps.close.lead} <span className="accent-text block">{apps.close.muted}</span>
          </>
        }
      />
    </main>
  );
}
