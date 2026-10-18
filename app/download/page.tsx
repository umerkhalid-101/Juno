import type { Metadata } from "next";
import { PageCta } from "@/components/ui/PageCta";
import { DlFaq, DlHero, DlMade } from "@/components/download/Download";
import { DOWNLOAD_HREF, download } from "@/lib/download";

const { title, description } = download.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/download" },
  openGraph: { title, description, url: "/download", siteName: "Juno", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function DownloadPage() {
  return (
    <main id="main">
      <DlHero />
      <DlMade />
      <DlFaq />
      <PageCta
        title={
          <>
            {download.close.lead} <span className="accent-text block">{download.close.muted}</span>
          </>
        }
        label={download.hero.primary}
        href={DOWNLOAD_HREF}
      />
    </main>
  );
}
