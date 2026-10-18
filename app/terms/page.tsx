import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { terms } from "@/lib/legal";

const { title, description } = terms.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title, description, url: "/terms", siteName: "Juno", type: "website" },
  twitter: { card: "summary", title, description },
};

export default function Page() {
  return (
    <main id="main">
      <LegalPage doc={terms} />
    </main>
  );
}
