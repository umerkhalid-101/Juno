import type { Metadata } from "next";
import { JobsHero } from "@/components/jobs/JobsHero";
import { Catalog } from "@/components/jobs/Catalog";
import { HowItWorks } from "@/components/jobs/HowItWorks";
import { JobsCta, JobsFaq } from "@/components/jobs/JobsClose";

const title = "AI Automations for Founders & Teams | Juno";
const description =
  "Put recurring work on Juno's schedule. Explore AI automations for competitor research, customer follow-ups, company updates and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/jobs" },
  openGraph: { title, description, url: "/jobs", siteName: "Juno", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function JobsPage() {
  return (
    <main id="main">
      <JobsHero />
      <Catalog />
      <HowItWorks />
      <JobsFaq />
      <JobsCta />
    </main>
  );
}
