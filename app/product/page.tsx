import type { Metadata } from "next";
import { PageCta } from "@/components/ui/PageCta";
import { PxHero } from "@/components/product/Overview";
import { Chapters } from "@/components/product/chapters";
import { Payoff } from "@/components/product/Payoff";
import { Day } from "@/components/product/PxRest";
import { close, meta } from "@/lib/product";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/product" },
  openGraph: { title: meta.title, description: meta.description, url: "/product", siteName: "Juno", type: "website" },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
};

export default function Page() {
  return (
    <main id="main">
      <PxHero />
      <Chapters />
      <Payoff />
      <Day />
      <PageCta
        title={
          <>
            {close.lead} <span className="accent-text block">{close.muted}</span>
          </>
        }
      />
    </main>
  );
}
