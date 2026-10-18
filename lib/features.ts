/**
 * Everything the Features page says, in one place. Feature names, one-liners and visual copy
 * are verbatim from runjuno.ai/features; problem lines, proof lines and story copy are new.
 */

export type GroupKey = "knows" | "does" | "makes" | "terms";
export type Tier = 1 | 2 | 3;

export type FeatureId =
  | "meeting-recorder"
  | "company-wiki"
  | "brand-context"
  | "skills"
  | "learnings"
  | "connected-apps"
  | "files-and-spreadsheets"
  | "automations"
  | "computer-and-browser"
  | "app-builder"
  | "website-builder"
  | "built-in-cms"
  | "image-and-video"
  | "vault"
  | "quick-ask"
  | "shared-conversations";

export type Feature = {
  id: FeatureId;
  name: string;
  group: GroupKey;
  tier: Tier;
  /** Live one-liner, verbatim. */
  line: string;
  /** The pain it removes. */
  problem: string;
  /** One concrete sentence of what it does for a team. */
  proof: string;
};

export const groups: {
  key: GroupKey;
  label: string;
  chapter: string;
  short: string;
  /** One accent per chapter, soft enough to sit together. */
  tint: string;
}[] = [
  {
    key: "knows",
    label: "Knowledge & context",
    chapter: "It knows your company",
    short: "Knows",
    tint: "#A6BBFF",
  },
  {
    key: "does",
    label: "Actions & tools",
    chapter: "It does the work",
    short: "Does",
    tint: "#8FDCCB",
  },
  {
    key: "makes",
    label: "Build & create",
    chapter: "It makes what you need",
    short: "Makes",
    tint: "#C9B8FF",
  },
  {
    key: "terms",
    label: "Team & access",
    chapter: "On your terms",
    short: "On your terms",
    tint: "#FFC9A8",
  },
];

export const tint = (g: GroupKey) => groups.find((x) => x.key === g)!.tint;

export const features: Feature[] = [
  {
    id: "meeting-recorder",
    name: "Meeting Recorder",
    group: "knows",
    tier: 1,
    line: "What happened on the call becomes company knowledge.",
    problem: "The best ideas die in the call",
    proof: "Requests, decisions, and promises from every call land where your team can act.",
  },
  {
    id: "company-wiki",
    name: "Company Wiki",
    group: "knows",
    tier: 1,
    line: "Company knowledge that stays useful, and up to date.",
    problem: "The answer lives in someone's head",
    proof: "Juno keeps the wiki current from calls, Slack, and docs, so nobody has to.",
  },
  {
    id: "brand-context",
    name: "Brand Context",
    group: "knows",
    tier: 2,
    line: "Your look. Your voice. Already part of the work.",
    problem: "Every draft needs rewriting",
    proof: "Colors, type, and tone come with every email, post, and page Juno makes.",
  },
  {
    id: "skills",
    name: "Skills",
    group: "knows",
    tier: 3,
    line: "Teach Juno your process. Put it to work again.",
    problem: "You explain the same process again",
    proof: "Save how your team does something once. Reuse it every time.",
  },
  {
    id: "learnings",
    name: "Learnings",
    group: "knows",
    tier: 3,
    line: "A correction today. A better starting point tomorrow.",
    problem: "You fix the same mistake twice",
    proof: "Tell Juno once how you like it. It remembers next time.",
  },
  {
    id: "connected-apps",
    name: "Connected Apps",
    group: "does",
    tier: 2,
    line: "Your stack, connected to an AI that can act on it.",
    problem: "Your tools don't talk to each other",
    proof: "Ask in one tool, get it done in another, with the context carried over.",
  },
  {
    id: "files-and-spreadsheets",
    name: "Files & Spreadsheets",
    group: "does",
    tier: 3,
    line: "Messy inputs. Useful, finished files.",
    problem: "The data is a mess of exports",
    proof: "Hand over the exports. Get back a clean, finished file.",
  },
  {
    id: "automations",
    name: "Automations",
    group: "does",
    tier: 2,
    line: "Set a job in motion. Get the work back, on schedule.",
    problem: "You have to remember to ask",
    proof: "Recurring work runs on a rhythm you set. Results come back ready.",
  },
  {
    id: "computer-and-browser",
    name: "Computer & Browser",
    group: "does",
    tier: 1,
    line: "A computer of its own. To handle the work in yours.",
    problem: "Not everything has an integration",
    proof: "No API? Juno signs in, clicks through, and gets it done.",
  },
  {
    id: "app-builder",
    name: "App Builder",
    group: "makes",
    tier: 1,
    line: "Turn “we need a tool for that” into a working app.",
    problem: "The tool you need doesn't exist",
    proof: "Describe it. Juno builds it on your data and publishes it.",
  },
  {
    id: "website-builder",
    name: "Website Builder",
    group: "makes",
    tier: 2,
    line: "Your whole website. Built, branded and published.",
    problem: "The site is always next quarter",
    proof: "A complete site in your brand, on your domain.",
  },
  {
    id: "built-in-cms",
    name: "Built-in CMS",
    group: "makes",
    tier: 3,
    line: "A home for your content. And the tools to publish it.",
    problem: "Publishing needs a developer",
    proof: "Write, organize, and publish without touching code.",
  },
  {
    id: "image-and-video",
    name: "Image & Video Creation",
    group: "makes",
    tier: 3,
    line: "Give the next idea something worth looking at.",
    problem: "The idea has no visual",
    proof: "Campaign visuals and short videos in your brand.",
  },
  {
    id: "vault",
    name: "Vault",
    group: "terms",
    tier: 2,
    line: "The credentials Juno needs. With access you control.",
    problem: "Sharing passwords feels risky",
    proof: "Juno uses what you approve, never sees what you don't.",
  },
  {
    id: "quick-ask",
    name: "Quick Ask",
    group: "terms",
    tier: 3,
    line: "One shortcut. Juno is right there.",
    problem: "Getting help means switching apps",
    proof: "Ask about anything on your screen without leaving your work.",
  },
  {
    id: "shared-conversations",
    name: "Shared Conversations",
    group: "terms",
    tier: 3,
    line: "Your team and Juno. On the same page.",
    problem: "Context gets lost in handoffs",
    proof: "Bring a teammate in. Everyone sees the same context.",
  },
];

export const feature = (id: FeatureId) => features.find((f) => f.id === id)!;

/* ------------------------------------------------------------------ page copy */

export const hero = {
  title: "So much built in.",
  sub: "From its own computer to your next app. Explore what comes with Juno.",
  secondary: "See it work",
  prompts: [
    "Ask Juno to draft the launch post",
    "Ask Juno to clean up these exports",
    "Ask Juno to build a launch room",
  ],
};

/** The statement: the page's whole argument in two lines. */
export const statement = {
  lead: "Most AI can talk.",
  punch: "Juno can work.",
};

export const compare = {
  title: "A chatbot tells you what to do.",
  muted: "Juno does it.",
  sub: "Same ask, different outcome. One hands you a list. The other hands you the work.",
  prompt: "Get Scheduled Reports ready to launch.",
  chatbot:
    "Here are some steps you could take: 1. Draft an announcement email. 2. Write social posts. 3. Update your help center. 4. Notify customers who requested it.",
  chatbotEnd: "You still have 4 things to do",
  approval: "Send the email and post the update?",
  junoEnd: "Ready for your yes",
};

export const chapters = {
  knows: {
    title: "It knows your company.",
    muted: "Like it's been there for years.",
    sub: "One customer call. Five ways it makes Juno smarter.",
    steps: [
      "Captured on the call",
      "Filed in the wiki",
      "Written in your brand",
      "Saved as a skill",
      "Learned for next time",
    ],
    end: "Every week, Juno knows a little more.",
  },
  does: {
    title: "It does the work.",
    muted: "Not just the talking.",
    sub: "In your tools, on a schedule, and on a computer of its own.",
    commands: {
      "connected-apps": "Turn the call request into a Linear issue",
      "files-and-spreadsheets": "Clean up these customer exports",
      automations: "Watch competitors every Friday",
      "computer-and-browser": "Draft the launch post in our CMS",
    } as Partial<Record<FeatureId, string>>,
  },
  makes: {
    title: "It makes what you need.",
    muted: "In your brand.",
    sub: "Apps, sites, posts, and visuals, from one sentence.",
    requests: {
      "app-builder": "Build a launch room for Scheduled Reports.",
      "website-builder": "Build our site for the spring collection.",
      "built-in-cms": "Publish the reports post.",
      "image-and-video": "Make a campaign visual for the focus launch.",
    } as Partial<Record<FeatureId, string>>,
  },
  terms: {
    title: "It works with your team.",
    muted: "On your terms.",
    sub: "Right where you need it, shared with who you choose, with access you control.",
  },
};

export const interlude = {
  line: "Halfway in. Here's what that adds up to.",
  figures: [
    { value: 16, label: "Features, one workspace" },
    { value: 4, label: "Abilities, one teammate" },
    { value: 1, label: "Conversation to run it all" },
  ],
};

export const outcomes: { title: string; features: FeatureId[] }[] = [
  {
    title: "Launch without loose ends.",
    features: ["brand-context", "website-builder", "built-in-cms", "automations"],
  },
  {
    title: "Never lose a customer request.",
    features: ["meeting-recorder", "connected-apps", "company-wiki"],
  },
  {
    title: "Ship the tool your team needs this week.",
    features: ["app-builder", "connected-apps", "vault"],
  },
  {
    title: "Walk into Monday already briefed.",
    features: ["automations", "files-and-spreadsheets", "company-wiki"],
  },
  {
    title: "Onboard a new hire in an afternoon.",
    features: ["company-wiki", "skills", "shared-conversations"],
  },
  {
    title: "Sound like yourself in every draft.",
    features: ["brand-context", "learnings", "skills"],
  },
];

export const together = {
  title: "With Juno,",
  muted: "you can finally",
  sub: "Built to work together, so what you want arrives whole.",
};

/** The last word before the close: a question, then Juno. */
export const runOn = {
  question: "What else is in there?",
  answer: "Ask",
  name: "Juno.",
};

export const finalCta = {
  title: "Put it all to work.",
  sub: "Your company. Your ideas. One Juno.",
  prompt: "What should we work on first?",
};
