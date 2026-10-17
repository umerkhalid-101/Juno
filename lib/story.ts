/**
 * The story world. Every name, number, and demo string on the page lives here.
 * Company: Orbit. Protagonist: Maya Chen. Feature in flight: Scheduled Reports.
 */
import {
  siFigma,
  siGithub,
  siGmail,
  siGoogledrive,
  siGoogleanalytics,
  siGooglecalendar,
  siHubspot,
  siIntercom,
  siJira,
  siLinear,
  siNotion,
  siZendesk,
} from "simple-icons";

export const company = {
  name: "Orbit",
  size: 30,
  what: "B2B analytics software",
  feature: "Scheduled Reports",
  launchDay: "Thursday",
};

export const people = {
  maya: { name: "Maya Chen", first: "Maya", role: "Cofounder and CEO", initials: "MC" },
  leo: { name: "Leo Park", first: "Leo", role: "Head of product", initials: "LP" },
  sam: { name: "Sam Rivera", first: "Sam", role: "Customer success", initials: "SR" },
};

/* ---------------------------------------------------------------- tools */

export type ToolId =
  | "slack"
  | "gmail"
  | "drive"
  | "notion"
  | "hubspot"
  | "linear"
  | "jira"
  | "intercom"
  | "github"
  | "figma"
  | "calendar"
  | "zendesk"
  | "analytics";

export type Tool = { id: ToolId; name: string; path: string; hex: string };

// simple-icons no longer ships Slack; this is the standard monochrome mark (24x24).
const slackPath =
  "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z";

export const tools: Record<ToolId, Tool> = {
  slack: { id: "slack", name: "Slack", path: slackPath, hex: "#E01E5A" },
  gmail: { id: "gmail", name: "Gmail", path: siGmail.path, hex: "#EA4335" },
  drive: { id: "drive", name: "Google Drive", path: siGoogledrive.path, hex: "#1FA463" },
  notion: { id: "notion", name: "Notion", path: siNotion.path, hex: "#FFFFFF" },
  hubspot: { id: "hubspot", name: "HubSpot", path: siHubspot.path, hex: "#FF7A59" },
  linear: { id: "linear", name: "Linear", path: siLinear.path, hex: "#5E6AD2" },
  jira: { id: "jira", name: "Jira", path: siJira.path, hex: "#0052CC" },
  intercom: { id: "intercom", name: "Intercom", path: siIntercom.path, hex: "#1F8DED" },
  github: { id: "github", name: "GitHub", path: siGithub.path, hex: "#FFFFFF" },
  figma: { id: "figma", name: "Figma", path: siFigma.path, hex: "#F24E1E" },
  calendar: { id: "calendar", name: "Calendar", path: siGooglecalendar.path, hex: "#4285F4" },
  zendesk: { id: "zendesk", name: "Zendesk", path: siZendesk.path, hex: "#03363D" },
  analytics: { id: "analytics", name: "Google Analytics", path: siGoogleanalytics.path, hex: "#E37400" },
};

/** The 10 connected tools, in hero and brain-ring order. */
export const connectedTools: ToolId[] = [
  "slack",
  "gmail",
  "drive",
  "notion",
  "hubspot",
  "linear",
  "jira",
  "intercom",
  "github",
  "figma",
];

/* --------------------------------------------------------- chapter 1 */

export type Notification = {
  id: string;
  tool: ToolId;
  source: string;
  from?: string;
  title: string;
  meta?: { label: string; tone: "danger" | "warning" | "muted" };
  time: string;
  /** Shown on mobile (5 of 8). */
  mobile: boolean;
  /** Compact text for the Chapter 5 ghosted callback. */
  short: string;
  /** Status chip while it waits on you. */
  wait: { label: string; tone: "neutral" | "warning" | "danger" };
  /** What Juno did with it. */
  handled: { text: string; status: "done" | "needs-approval" };
};

export type CardStatus = "waiting" | Notification["handled"]["status"];

export const notifications: Notification[] = [
  {
    id: "n1",
    tool: "slack",
    source: "#launch",
    from: "Sam Rivera",
    title: "Are we still on for Scheduled Reports Thursday?",
    time: "8:41 AM",
    mobile: true,
    short: "#launch: Still on for Thursday?",
    wait: { label: "Waiting", tone: "neutral" },
    handled: { text: "Replied to Sam: launch is on for Thursday", status: "done" },
  },
  {
    id: "n2",
    tool: "gmail",
    source: "Northstar Capital",
    from: "Ravi Menon",
    title: "Hi Maya, any update for this month?",
    time: "8:32 AM",
    mobile: true,
    short: "Investor: any update this month?",
    wait: { label: "Update overdue", tone: "warning" },
    handled: { text: "Investor update drafted for Ravi", status: "needs-approval" },
  },
  {
    id: "n3",
    tool: "intercom",
    source: "Support",
    title: "3 customers asking about scheduled exports",
    time: "8:20 AM",
    mobile: true,
    short: "3 customers asking about exports",
    wait: { label: "3 open", tone: "neutral" },
    handled: { text: "3 answers drafted for customers", status: "needs-approval" },
  },
  {
    id: "n4",
    tool: "linear",
    source: "Scheduled Reports",
    title: "SR-112 is blocked",
    time: "8:15 AM",
    mobile: true,
    short: "SR-112 is blocked",
    wait: { label: "Blocked", tone: "danger" },
    handled: { text: "SR-112 unblocked, owner pinged", status: "done" },
  },
  {
    id: "n5",
    tool: "calendar",
    source: "Northwind check-in",
    title: "Customer call in 10 min, no prep",
    time: "now",
    mobile: false,
    short: "Customer call in 10 min, no prep",
    wait: { label: "No prep", tone: "warning" },
    handled: { text: "Call brief ready", status: "done" },
  },
  {
    id: "n6",
    tool: "hubspot",
    source: "Deals",
    title: "Deal with Northwind idle for 14 days · $48,000",
    time: "8:02 AM",
    mobile: true,
    short: "Northwind deal idle 14 days",
    wait: { label: "Going cold", tone: "warning" },
    handled: { text: "Northwind follow-up drafted", status: "needs-approval" },
  },
  {
    id: "n7",
    tool: "notion",
    source: "Launch doc",
    title: "Launch doc last edited 9 days ago",
    time: "Mon",
    mobile: false,
    short: "Launch doc stale for 9 days",
    wait: { label: "Out of date", tone: "neutral" },
    handled: { text: "Launch doc updated", status: "done" },
  },
  {
    id: "n8",
    tool: "slack",
    source: "Direct message",
    from: "Leo Park",
    title: "Can you review the release notes?",
    time: "8:46 AM",
    mobile: false,
    short: "Leo: review the release notes?",
    wait: { label: "Waiting", tone: "neutral" },
    handled: { text: "Release notes reviewed, 2 edits suggested", status: "done" },
  },
];


/* --------------------------------------------------------- chapter 2 */

export const knowledgeAreas = [
  { id: "customers", label: "Customers", tools: ["hubspot", "intercom", "gmail"] },
  { id: "support", label: "Support", tools: ["intercom", "gmail", "slack"] },
  { id: "product", label: "Product", tools: ["linear", "jira", "github", "figma"] },
  { id: "sales", label: "Sales", tools: ["hubspot", "gmail", "drive"] },
  { id: "brand", label: "Brand", tools: ["figma", "notion", "drive"] },
  { id: "market", label: "Market", tools: ["notion", "slack", "drive"] },
] as const satisfies ReadonlyArray<{ id: string; label: string; tools: readonly ToolId[] }>;

/* --------------------------------------------------------- chapter 3 */

export const workDemo = {
  prompt:
    "Tell customers who asked for scheduled exports that Scheduled Reports ships Thursday.",
  checking: "Checking Intercom and Linear",
  found: "Found 3 customers who asked.",
  sources: [
    { tool: "intercom" as ToolId, label: "3 conversations" },
    { tool: "linear" as ToolId, label: "SR-112 unblocked" },
  ],
  email: {
    to: [
      { name: "Priya Shah", company: "Northwind" },
      { name: "Diego Alvarez", company: "Tallyhq" },
      { name: "Hannah Okafor", company: "Meridian" },
    ],
    subject: "Scheduled Reports ships Thursday",
    greeting: "Hi Priya,",
    body: [
      "You asked us about scheduled exports a few weeks ago, so you're the first to hear: Scheduled Reports ships this Thursday.",
      "Pick any Orbit dashboard, choose a time, and it lands in your team's inbox as a PDF or CSV. No more Monday screenshots.",
      "Thanks for pushing us on this one.",
    ],
    signoff: "Maya",
  },
  reply: "I drafted a personal note for the 3 customers who asked. Want me to send it Thursday at 9?",
  approvalQuestion: "Send Thursday at 9?",
};

/* --------------------------------------------------------- chapter 4 */

export const jobs = [
  {
    id: "j1",
    day: 0,
    schedule: "EVERY MON 9:00 AM",
    title: "Weekly metrics report",
    tool: "notion" as ToolId,
    result: "Posted to Notion",
    top: 14,
  },
  {
    id: "j2",
    day: 2,
    schedule: "EVERY WED 2:00 PM",
    title: "Competitor watch",
    tool: "drive" as ToolId,
    result: "4 changes found",
    top: 46,
  },
  {
    id: "j3",
    day: 4,
    schedule: "EVERY FRI 4:00 PM",
    title: "Investor update draft",
    tool: "gmail" as ToolId,
    result: "Draft ready for you",
    top: 70,
  },
];

/** Small ambient tasks Juno handles between scheduled jobs. */
export const ambientTasks = [
  { day: 1, top: 24, label: "Triaged 6 Intercom chats" },
  { day: 1, top: 66, label: "Updated 3 HubSpot deals" },
  { day: 3, top: 20, label: "Filed SR-118 in Linear" },
  { day: 3, top: 60, label: "Prepped 2 customer calls" },
];

export const days = [
  { short: "Mon", date: "13" },
  { short: "Tue", date: "14" },
  { short: "Wed", date: "15" },
  { short: "Thu", date: "16" },
  { short: "Fri", date: "17" },
];

/* --------------------------------------------------------- chapter 5 */

export const approvalQueue = [
  { id: "a1", tool: "gmail" as ToolId, title: "Send launch note to 3 customers", meta: "Thursday, 9:00 AM" },
  { id: "a2", tool: "slack" as ToolId, title: "Post release notes to #launch", meta: "When you approve" },
  { id: "a3", tool: "linear" as ToolId, title: "Move SR-112 to In Progress and ping Leo", meta: "Unblocked by GitHub PR #482" },
];

/* --------------------------------------------------------- proof */

// PLACEHOLDER: fictional customer wordmarks
export const trustLogos = ["Lumen Labs", "Fieldnote", "Paperplane", "Kestrel", "Brightside", "Quarry"];

/* --------------------------------------------------------- chapter 7 */

export const faqs: { q: string; a: string; placeholder?: string }[] = [
  {
    q: "What can Juno actually do?",
    a: "Writes, researches, builds apps, runs recurring jobs, and acts across your connected tools.",
  },
  {
    q: "Does it act without asking?",
    a: "No. In Ask mode Juno checks with you before sending, posting, or changing anything. You can switch tools to Auto when you're ready.",
  },
  {
    q: "Which tools does it work with?",
    a: "Slack, Gmail, Google Drive, Notion, HubSpot, Linear, Jira, Intercom, GitHub, Figma, and more, plus its own browser.",
  },
  {
    q: "Will it sound like us?",
    a: "Yes. Juno learns your brand, voice, and corrections, and applies them next time.",
  },
  {
    q: "Is our data secure?",
    a: "Security details are on the way. This answer is a placeholder until the security page is ready.",
    placeholder: "security answer",
  },
  {
    q: "How much does it cost?",
    a: "Pricing details are on the way. This answer is a placeholder until pricing is published.",
    placeholder: "pricing answer",
  },
];

export const nav = [
  { label: "Product", href: "/#work" },
  { label: "Automations", href: "/jobs" },
  { label: "Apps", href: "/#apps" },
  { label: "Download", href: "/#close" },
];
