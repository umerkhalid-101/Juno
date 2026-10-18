/**
 * The Contact page (/contact). Copy is verbatim from runjuno.ai/contact; Juno's three prompts
 * and the replies are [new], written for the conversation this page draws.
 */

export const PRIVACY_HREF = "/privacy";

export const contact = {
  meta: {
    title: "Contact the Juno Team | Product Questions & Support",
    description:
      "Talk to the Juno team about your company, product questions or support. Get help bringing an AI chief of staff into the way your team works.",
  },
  title: "Let’s",
  word: "talk.",
  sub: "Questions, ideas, or a little help with Juno. We’d love to hear from you.",
  formLabel: "Your contact details and message",
  // from the live page's description: "your company, product questions or support"
  topics: ["Product questions", "Support", "Your company"],
  fields: {
    name: { label: "Name", prompt: "Hi. What should we call you?" }, // prompt [new]
    email: { label: "Email", prompt: "And the best email to reach you?" }, // prompt [new]
    message: { label: "Message", prompt: "What’s on your mind?" }, // prompt [new]
  },
  send: "Send message",
  privacy: { before: "Read our", link: "Privacy policy", after: "." },
  // [new]
  sent: (name: string, email: string) => `Thanks, ${name}. Your message is with the team. We’ll reply to ${email}.`,
  failed: "That didn’t send. Please try again in a moment.",
};
