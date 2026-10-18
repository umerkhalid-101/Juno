import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacy } from "@/lib/legal";

const { title, description } = privacy.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description, url: "/privacy", siteName: "Juno", type: "website" },
  twitter: { card: "summary", title, description },
};

export default function Page() {
  return (
    <main id="main">
      <LegalPage doc={privacy} />
    </main>
  );
}
