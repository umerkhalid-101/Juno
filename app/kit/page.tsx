import type { Metadata } from "next";
import { KitView } from "./KitView";

export const metadata: Metadata = { title: "Component kit", robots: { index: false, follow: false } };

export default function KitPage() {
  return <KitView />;
}
