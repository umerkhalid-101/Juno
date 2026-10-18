/**
 * Everything the Product page ("Inside Juno") says. Live copy is verbatim from runjuno.ai/product
 * with the cast swaps (Maya as a teammate → Leo, Alex as a teammate → Emma). Copy marked [new]
 * is story glue written for this page. Numbers inside demos are illustrative.
 */

import type { ToolId } from "@/lib/story";

export type Src = ToolId | "call" | "file" | "browser" | "juno" | "cms";

/* ------------------------------------------------------------------ hero and overview */

export const hero = {
  title: "Inside Juno.",
  secondary: { label: "See all features", href: "/features" }, // [new]
  you: "Let's get this launched.",
  juno: "On it. Three things to get it out the door.", // [new]
  tasks: ["Write the announcement", "Create the social visuals", "Prepare customer emails"],
  approval: "Shall I send the email and post on LinkedIn and X?",
};

export const overview = {
  title: "Everything Juno does,", // [new]
  muted: "in one place.",
  sub: "Seven parts of one product. Pick one, or take the tour.", // [new]
};

export const previews = [
  { title: "Company knowledge", href: "#knowledge" },
  { title: "Apps, sites & dashboards", href: "#apps" },
  { title: "Images & video", href: "#brand" },
  { title: "Tasks, taken care of", href: "#tools" },
  { title: "Jobs", href: "#jobs" },
  { title: "A computer of its own", href: "#computer" },
];

/* ------------------------------------------------------------------ the seven chapters */

export type Pattern = "tabs" | "list" | "autoplay" | "stepper";

export type Chapter = {
  id: string;
  nav: string;
  n: string;
  name: string;
  title: string;
  muted: string;
  sub: string;
  pattern: Pattern;
  mirror?: boolean;
  items: { name: string; line?: string }[];
  link?: { label: string; href: string };
};

export const chapters: Chapter[] = [
  {
    id: "knowledge",
    nav: "Knowledge",
    n: "01",
    name: "Company knowledge",
    title: "Make the next decision",
    muted: "with the full picture.",
    sub: "Scattered across your tools. Connected in one answer.",
    pattern: "tabs",
    items: [{ name: "Connected sources" }, { name: "Company Wiki" }, { name: "Uploaded files" }],
  },
  {
    id: "brand",
    nav: "Brand",
    n: "02",
    name: "Brand, skills & memory",
    title: "More like you.",
    muted: "Less rewriting.",
    sub: "Put that context to work with your brand, skills, and preferences. Get a feature announcement that already sounds like you.",
    pattern: "list",
    items: [
      { name: "Brand context", line: "Your colors, type, and voice in every draft." }, // [new]
      { name: "Reusable skills", line: "Save how you do something. Use it again." }, // [new]
      { name: "Editable learnings", line: "Correct it once. It remembers next time." }, // [new]
    ],
  },
  {
    id: "computer",
    nav: "Computer",
    n: "03",
    name: "Computer & browser",
    title: "Its own computer.",
    muted: "More off your plate.",
    sub: "Give Juno the hands-on work, too. Research the web, fix the spreadsheet, or prepare a draft in your CMS.",
    pattern: "autoplay",
    items: [{ name: "Work with files" }, { name: "Research the web" }, { name: "Use websites" }],
  },
  {
    id: "apps",
    nav: "Apps",
    n: "04",
    name: "App builder",
    title: "Give your team",
    muted: "the tool it's missing.",
    sub: "Build the tool your team needs, right in chat. A launch dashboard puts owners, blockers, and customer commitments in one place.",
    pattern: "stepper",
    items: [{ name: "Build & preview" }, { name: "Company data" }, { name: "Publish & domains" }],
    link: { label: "See what you could build", href: "/#apps" },
  },
  {
    id: "content",
    nav: "Content",
    n: "05",
    name: "Content & CMS",
    title: "Keep publishing.",
    muted: "Keep people interested.",
    sub: "Organize posts, publish to your website, and collect leads with Juno's built-in CMS.",
    pattern: "list",
    mirror: true,
    items: [
      { name: "Collections", line: "Every post, organized and ready to publish." }, // [new]
      { name: "Drafts & publishing", line: "You review. Juno publishes." }, // [new]
      { name: "Form submissions", line: "Signups land in your CMS as leads." }, // [new]
    ],
  },
  {
    id: "tools",
    nav: "Tools",
    n: "06",
    name: "Connected tools & permissions",
    title: "Turn commitments",
    muted: "into follow‑through.",
    sub: "Carry the context into your tools. Turn a customer-call request into a Linear issue, with the details already attached.",
    pattern: "tabs",
    items: [{ name: "Connected actions" }, { name: "Browser access" }, { name: "Ask / Auto" }],
  },
  {
    id: "jobs",
    nav: "Jobs",
    n: "07",
    name: "Jobs",
    title: "Stay ahead.",
    muted: "Without checking everything.",
    sub: "Make useful work recurring. A weekly competitor watch brings you the changes and suggested responses, so you can focus on the decisions.",
    pattern: "list",
    items: [
      { name: "Instructions", line: "Say what to watch and what you want back." }, // [new]
      { name: "Schedule", line: "Pick the rhythm. Juno shows up on time." }, // [new]
      { name: "Results", line: "Briefings with sources and a next move." }, // [new]
    ],
    link: { label: "Explore automations", href: "/jobs" },
  },
];

/* ------------------------------------------------------------------ from launch to loyalty */

export const payoff = {
  title: "They asked. You shipped.",
  muted: "Juno follows up.",
  sub: "Connect a release to the customers who wanted it. Make every follow-up personal.",
  approval: "Ready to send these personal follow-ups?",
};

/* ------------------------------------------------------------------ the rest */

export const day = {
  title: "Less switching.",
  muted: "More doing.",
  tiles: [
    { title: "Quick Ask on Mac.", body: "Ask about your screen. Stay in your flow." },
    { title: "Shared conversations.", body: "Bring a teammate in. Keep the context together." },
    { title: "Projects & team access.", body: "Organize the work. Choose who can use each tool." },
  ],
};

export const deeper = [
  { over: "Every feature", label: "See all 16 features", href: "/features" },
  { over: "Recurring work", label: "Explore automations", href: "/jobs" },
  { over: "Apps & sites", label: "See what you could build", href: "/#apps" },
];

export const close = {
  lead: "More off your plate.",
  muted: "More moving forward.",
};

export const meta = {
  title: "Product | Juno",
  description:
    "Explore Juno's chat and Desk, company knowledge, skills, its own computer and browser, app builder, content, connected tools, and recurring Jobs.",
};
