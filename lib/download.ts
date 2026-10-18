/**
 * The Download page (/download). Copy is verbatim from runjuno.ai/download; [new] marks the
 * few words added for this design.
 */

export const DOWNLOAD_HREF = "https://www.runjuno.ai/download/mac";
export const BROWSER_HREF = "https://www.runjuno.ai/login";

export const download = {
  meta: {
    title: "Download Juno for Mac | Juno",
    description:
      "Download Juno for Mac. Use Quick Ask to get help with what’s on your screen, ask by voice and keep your company’s work moving without switching apps.",
  },
  hero: {
    lead: "Keep",
    word: "Juno",
    tail: "close.",
    sub: "Ask about your screen. Talk an idea through. Keep work moving, right from your Mac.",
    primary: "Download for Mac",
    secondary: "Open in your browser",
    note: "For Apple silicon and Intel Macs.",
  },
  screen: {
    app: "Launch plan",
    label: "Launch checklist",
    title: "Ready for Friday.",
    sub: "Northwind 2.0 goes live Friday at 9am. One thing left.",
    due: "Fri, Oct 24",
    pages: ["Overview", "Launch checklist", "Announcement", "Customer email"],
    checklist: [
      { task: "Website updated", owner: "MK", tint: "#6C7CFF", due: "Mon", status: "Done" },
      { task: "Help center articles", owner: "AR", tint: "#E0875A", due: "Tue", status: "Done" },
      { task: "Pricing page live", owner: "JS", tint: "#3BA57A", due: "Wed", status: "Done" },
      { task: "Customer email", owner: "LT", tint: "#B46CD8", due: "Thu", status: "Draft" },
    ],
    quick: "Right here. Ready to help.",
    attach: "Product launch",
    placeholder: "Ask about your screen…",
    ask: "What’s left before launch?",
    answer: "Just the customer email.",
  },
  shortcut: {
    title: "One shortcut.",
    muted: "Right where you’re working.",
    sub: "Your screen. Your company. A little help from Juno.",
    keys: ["⌃", "⌘", "J"],
    try: "Try Quick Ask",
  },
  made: {
    title: "Made for the way",
    muted: "you work.",
    cards: [
      {
        title: "Say it. Or type it.",
        body: "A question, a rough idea, a quick second opinion. Start however it comes naturally.",
      },
      {
        title: "Pick up where you left off.",
        body: "Your Quick Ask conversation stays with you. Open Juno and keep the work going.",
      },
      {
        title: "Let the updates come to you.",
        body: "Desktop notifications bring you back when there’s something new from Juno.",
      },
    ],
  },
  faq: {
    title: "A few good",
    muted: "questions.",
    items: [
      {
        q: "How do I install Juno?",
        a: "Download the Mac app, open the disk image and drag Juno into Applications. Open Juno and sign in with your account.",
      },
      {
        q: "What’s the Quick Ask shortcut?",
        a: "The default is Control + Command + J. You can change it in Juno’s settings. If you used an earlier version, your existing shortcut may be preserved.",
      },
      {
        q: "How does Quick Ask use my screen?",
        a: "Using the shortcut captures a screenshot for your conversation with Juno. macOS asks for Screen Recording permission. Microphone access lets you ask a question aloud; you can also type.",
      },
      {
        q: "Can I still use Juno in my browser?",
        a: "Yes. Use the same account to access your company and conversations. Open Juno in your browser.",
      },
    ],
  },
  close: { lead: "See you", muted: "on your Mac." },
};
