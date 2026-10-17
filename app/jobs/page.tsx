import type { Metadata } from "next";
import { JobsHero } from "@/components/jobs/JobsHero";

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
      {/* the catalog lands here next */}
      <div id="jobs-catalog" className="h-[60vh]" />
    </main>
  );
}
