"use client";

import { FaqConsole } from "@/components/ui/FaqConsole";

const faqs = [
  {
    q: "Does my Job have to be on this page?",
    a: "Start with the outcome you want. These examples are starting points for what you could hand over, not a fixed menu. Tell Juno what matters, which tools are involved and how often it should come back to the work.",
  },
  {
    q: "How much control do I have?",
    a: "You set the instructions and schedule. Juno brings the work and the next step back into the conversation, where you can review, refine and decide how to proceed.",
  },
  {
    q: "What makes a good Job to hand over?",
    a: "Work that keeps coming back, needs context from more than one place, and has a useful next action. Think keeping a launch on track, helping a stuck customer or finding the next company to talk to.",
  },
];

export function JobsFaq() {
  return (
    <section aria-labelledby="jobs-faq-title" className="chapter">
      <div className="container-page">
        <h2 id="jobs-faq-title" className="t-display-l text-center">
          A few good questions.
        </h2>
        <FaqConsole items={faqs} />
      </div>
    </section>
  );
}
