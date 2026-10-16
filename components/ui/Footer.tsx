import { MascotMark } from "@/components/mascot/Mascot";
import { FooterMark } from "./FooterMark";

const cols = [
  { label: "Product", links: ["Inside Juno", "Company knowledge", "Jobs", "App builder", "Connected tools"] },
  { label: "Get started", links: ["Get Juno", "Sign in", "Download", "Contact"] },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <a href="#top" className="inline-flex items-center gap-2.5" aria-label="Juno home">
            <MascotMark size={28} />
            <span className="text-[19px] font-semibold tracking-[-0.03em]">Juno</span>
          </a>
          <p className="mt-4 max-w-[34ch] text-[15px] leading-6 text-muted">Juno runs the work. You run the company.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.label} aria-label={c.label} className="md:col-span-3">
            <p className="t-eyebrow mb-4 text-muted">{c.label}</p>
            <ul className="space-y-1">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="inline-flex min-h-9 items-center text-[15px] text-text/80 transition-colors hover:text-text">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <FooterMark />
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-6 font-mono text-[12px] text-muted">
          <span>© 2026 Juno</span>
          <ul className="flex items-center gap-6">
            <li><a href="#" className="hover:text-text">Privacy</a></li>
            <li><a href="#" className="hover:text-text">Terms</a></li>
            <li><a href="#top" className="hover:text-text">Back to top</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
