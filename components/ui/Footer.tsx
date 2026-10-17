import { ArrowUp } from "lucide-react";
import { FooterMark } from "./FooterMark";

const links = [
  { label: "Product", href: "#brain" },
  { label: "Jobs", href: "#work" },
  { label: "Apps", href: "#apps" },
  { label: "Download", href: "#" },
  { label: "Sign in", href: "#" },
  { label: "Contact", href: "#" },
];

/** The close of the page: one line, a handful of links, then the wordmark Juno peeks over. */
export function Footer() {
  return (
    <footer className="relative">
      <div className="container-page flex flex-col gap-10 pt-20 md:flex-row md:items-end md:justify-between md:pt-28">
        <p className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-text md:text-[44px]">
          Juno runs the work.
          <span className="block text-muted">You run the company.</span>
        </p>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-3 gap-x-10 gap-y-3 md:gap-x-12">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group relative inline-block py-1 text-[15px] text-muted transition-colors duration-200 hover:text-text"
                >
                  {l.label}
                  <span className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <FooterMark />

      <div className="container-page flex flex-wrap items-center justify-between gap-4 pb-8 pt-6 text-[13px] text-muted">
        <span>© 2026 Juno</span>
        <span className="flex items-center gap-6">
          <a href="#" className="transition-colors hover:text-text">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-text">
            Terms
          </a>
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-text"
          >
            Back to top
            <ArrowUp
              size={13}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        </span>
      </div>
    </footer>
  );
}
