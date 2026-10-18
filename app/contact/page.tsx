import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/Contact";
import { contact } from "@/lib/contact";

const { title, description } = contact.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact", siteName: "Juno", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return (
    <main id="main">
      <ContactPage />
    </main>
  );
}
