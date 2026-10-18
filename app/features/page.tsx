import type { Metadata } from "next";
import { FxHero } from "@/components/features/FxHero";
import { FxStatement } from "@/components/features/FxStatement";
import { FxKnows } from "@/components/features/FxKnows";
import { FxDoes } from "@/components/features/FxDoes";
import { FxMakes } from "@/components/features/FxMakes";
import { FxTerms } from "@/components/features/FxTerms";
import { FxTogether } from "@/components/features/FxTogether";
import { FxCta } from "@/components/features/FxCta";

const title = "AI Features: Computer, Browser, Apps & More | Juno";
const description =
  "Explore Juno’s computer and browser, app builder, company wiki, vault, meeting recorder, built-in CMS and more. See what each feature can do.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features" },
  openGraph: { title, description, url: "/features", siteName: "Juno", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function FeaturesPage() {
  return (
    <main id="main">
      <FxHero />
      <FxStatement />
      {/* hidden for now: <FxCompare /> */}
      <FxKnows />
      <FxDoes />
      <FxMakes />
      <FxTerms />
      <FxTogether />
      <FxCta />
    </main>
  );
}
