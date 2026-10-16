# Placeholders

Everything below is fictional or reserved and must be swapped or removed before launch.
Each one is tagged in code with `data-placeholder="true"` and/or a `// PLACEHOLDER` comment.

| What | Where | Notes |
| --- | --- | --- |
| FAQ 5: Is our data secure? | `lib/story.ts` (`faqs`) | Answer pending. |
| FAQ 6: How much does it cost? | `lib/story.ts` (`faqs`) | Answer pending. |
| Free plan or trial line | `components/chapters/Ch7Close.tsx` | Line under the final CTA. |
| Link targets (`#get`, `#download`, `#signin`, footer links) | `components/ui/Nav.tsx`, `Footer.tsx`, chapters | Point at real routes when available. |
| Vendor portal in "A computer of its own" (`billing.cloudhost.example`) | `components/chapters/ChComputer.tsx` | Fictional vendor, kept generic on purpose. |
| Demo story world (Orbit, Maya Chen, customers, numbers) | `lib/story.ts` | Fictional by design; keep consistent. |
| Trust strip wordmarks (Lumen Labs and others) | `components/ui/TrustStrip.tsx` | Only on the hidden `/kit` page now. Not on the homepage. |

The mascot is the official asset (`public/mascot/juno.svg`), inlined in `components/mascot/Mascot.tsx` so the eyes can animate.
