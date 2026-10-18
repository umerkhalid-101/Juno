import type { FeatureId } from "@/lib/features";

/**
 * Scroll to a feature. Sections that move their features sideways (the storyline) listen for
 * `fx:goto` and handle it themselves; everything else is a plain anchor.
 */
export function goToFeature(id: FeatureId) {
  const ev = new CustomEvent("fx:goto", { detail: id, cancelable: true });
  window.dispatchEvent(ev);
  history.replaceState(null, "", `#${id}`);
  if (ev.defaultPrevented) return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 120;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
