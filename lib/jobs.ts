import type { ToolId } from "@/lib/story";

/**
 * The Automations page (/jobs). Titles, descriptions, the ask and the approval are verbatim
 * from the live page (runjuno.ai/jobs, "See the handoff"); schedules, sources, activity and
 * checklists are the brief's demo microcopy. People and companies are fictional and match
 * the rest of the site (Maya, Sam, Northwind, Orbit Studio).
 */

/** A source Juno works in: a real integration, or Juno's own browser for the open web. */
export type Source = ToolId | "browser" | "cms";

export type GroupId = "grow" | "keep" | "move" | "ahead";

export const groups: { id: GroupId; tab: string; title: string; sub: string }[] = [
  {
    id: "grow",
    tab: "Grow the business",
    title: "Grow the business.",
    sub: "More opportunities. Less busywork between you and the next customer.",
  },
  {
    id: "keep",
    tab: "Keep customers",
    title: "Give customers a reason to stay.",
    sub: "The right help, at the moment it makes a difference.",
  },
  {
    id: "move",
    tab: "Keep work moving",
    title: "Keep good work moving.",
    sub: "All the follow-through. Without you doing all the following up.",
  },
  {
    id: "ahead",
    tab: "Stay ahead",
    title: "Stay a step ahead.",
    sub: "Know what changed, why it matters and what to do next.",
  },
];

export type Job = {
  slug: string;
  group: GroupId;
  title: string;
  /** One line under the title (live). */
  summary: string;
  /** The live handoff's tagline. */
  outcome: string;
  /** What Juno connects (live). */
  context: string;
  /** What comes back (live). */
  result: string;
  /** What you ask Juno (live). */
  ask: string;
  /** Your call: the approval Juno brings back (live). */
  action: string;
  /** Mono schedule chip. */
  schedule: string;
  /** The schedule in plain words. */
  when: string;
  /** Week strip, Monday = 0. Empty means it runs on an event, not a day. */
  days: number[];
  connects: Source[];
  activity: [string, string, string];
  handles: [string, string, string, string];
};

export const jobs: Job[] = [
  // Grow the business
  {
    slug: "find-our-next-customers",
    group: "grow",
    title: "Find our next customers",
    summary: "Find companies with a reason to buy. Have the introduction ready.",
    outcome: "Start with a reason to talk. Not a blank prospect list.",
    context:
      "Who your best customers are, what they buy you for, and signals that another company has the same need.",
    result:
      "A shortlist with the reason each company fits, the right person to contact and a personal introduction.",
    ask: "Every week, find companies that need what we do. Get the introductions ready.",
    action: "Add the prospects to our CRM and send the introductions?",
    schedule: "Every Mon · 9:00 AM",
    when: "Every Monday at 9:00 AM.",
    days: [0],
    connects: ["browser", "hubspot", "notion"],
    activity: [
      "Scanned hiring and growth signals",
      "Checked HubSpot for existing contacts",
      "Matched to your ideal customer",
    ],
    handles: [
      "Spots companies showing a reason to buy",
      "Skips anyone already in HubSpot",
      "Matches them to your ideal customer",
      "Writes a personal introduction",
    ],
  },
  {
    slug: "turn-search-into-signups",
    group: "grow",
    title: "Turn search into signups",
    summary: "Find what buyers are searching for. Create the pages that answer.",
    outcome: "Give your next customer a better way to find you.",
    context:
      "Questions customers ask, the terms people search for, and gaps in your existing content.",
    result:
      "A clear opportunity, a page or article built around it, and the next piece to improve.",
    ask: "Find the searches we should be winning and keep the right content moving.",
    action: "Add this comparison page to our site and link it from the blog?",
    schedule: "Every Wed · 9:00 AM",
    when: "Every Wednesday at 9:00 AM.",
    days: [2],
    connects: ["browser", "cms", "drive"],
    activity: [
      "Found 12 high-intent searches",
      "Reviewed the top-ranking pages",
      "Drafted a comparison page",
    ],
    handles: [
      "Finds high-intent searches",
      "Reviews the pages that rank today",
      "Drafts the page in your brand",
      "Prepares it in your CMS",
    ],
  },
  {
    slug: "make-every-ad-dollar-count",
    group: "grow",
    title: "Make every ad dollar count",
    summary: "Catch wasted spend. Find the winner. Have the next test ready.",
    outcome: "Spend less time in ad dashboards. Make the next move clearer.",
    context:
      "Campaign performance, lead quality, the landing page and the message in each creative.",
    result: "The ad worth backing, the spend that needs attention and a new creative to test.",
    ask: "Keep an eye on our ads. Show me what to stop, what to scale and what to try next.",
    action: "Pause the tired creative and launch this new version with the same test budget?",
    schedule: "Every Mon · 9:30 AM",
    when: "Every Monday at 9:30 AM.",
    days: [0],
    connects: ["browser", "hubspot"],
    activity: ["Compared cost per lead", "Matched ads to new customers", "Designed a new creative"],
    handles: [
      "Compares cost per lead across ads",
      "Ties ads to real customers",
      "Flags wasted spend",
      "Designs the next test",
    ],
  },
  // Give customers a reason to stay
  {
    slug: "catch-customers-before-they-leave",
    group: "keep",
    title: "Catch customers before they leave",
    summary: "Connect the warning signs. Bring a personal way to win them back.",
    outcome: "A timely conversation beats a cancellation surprise.",
    context: "Unresolved support issues, product usage, promised fixes and upcoming renewals.",
    result:
      "An account that needs attention, what is getting in the way and a useful response ready to send.",
    ask: "Watch for customers who need help before they give up on us.",
    action: "Send this check-in and create a follow-up for the account owner?",
    schedule: "Every Mon · 8:00 AM",
    when: "Every Monday at 8:00 AM.",
    days: [0],
    connects: ["intercom", "hubspot", "linear"],
    activity: [
      "Flagged a renewal in 30 days",
      "Found an open support thread",
      "Linked it to a Linear blocker",
    ],
    handles: [
      "Watches upcoming renewals",
      "Connects support threads to blockers",
      "Finds what’s really in the way",
      "Drafts a personal check-in",
    ],
  },
  {
    slug: "get-new-customers-to-their-first-win",
    group: "keep",
    title: "Get new customers to their first win",
    summary: "Spot where a new customer gets stuck. Send the help they actually need.",
    outcome: "Less “where do I start?” More “this is exactly what we needed.”",
    context:
      "What a customer came to do, the steps they have completed and the questions they have asked.",
    result: "The missing step and a personal nudge with the right guide, example or offer of help.",
    ask: "Keep an eye on new customers and help them get to their first useful result.",
    action: "Send Maya the setup guide and check back after she connects her data?",
    schedule: "Every weekday · 10:00 AM",
    when: "Every weekday at 10:00 AM.",
    days: [0, 1, 2, 3, 4],
    connects: ["hubspot", "intercom", "notion"],
    activity: ["Checked new accounts' setup", "Found where they stopped", "Picked the right guide"],
    handles: [
      "Tracks setup for every new account",
      "Spots the step they stopped at",
      "Picks the right guide",
      "Writes a short, personal nudge",
    ],
  },
  {
    slug: "close-the-loop-with-customers",
    group: "keep",
    title: "Close the loop with customers",
    summary: "Match what shipped to who asked. Make every update feel personal.",
    outcome: "Make customers feel remembered, long after the first conversation.",
    context:
      "The feature that just shipped and the customers who asked for it in calls, emails and support.",
    result:
      "The people to tell and a personal update that connects the new feature to what each person needed.",
    ask: "Every Friday, tell the customers whose requests we shipped. Make it personal.",
    action: "Send these updates and let the account owners know?",
    schedule: "Every Fri · 9:00 AM",
    when: "Every Friday at 9:00 AM.",
    days: [4],
    connects: ["intercom", "linear", "gmail"],
    activity: [
      "Found 3 customers who asked",
      "Matched them to the release",
      "Wrote a personal note for each",
    ],
    handles: [
      "Remembers every feature request",
      "Matches releases to who asked",
      "Writes a personal note for each",
      "Waits for your yes to send",
    ],
  },
  // Keep good work moving
  {
    slug: "keep-every-promise-moving",
    group: "move",
    title: "Keep every promise moving",
    summary: "Remember the commitments. Chase the loose ends. Bring back the blockers.",
    outcome: "You can stop being the company’s reminder system.",
    context:
      "Decisions from meetings, task owners, due dates and the work that has happened since.",
    result: "What is moving, what is blocked and a specific follow-up for the person who can help.",
    ask: "Keep track of what we commit to in meetings and make sure nothing quietly slips.",
    action: "Check in with Sam about the approval blocking Friday’s launch?",
    schedule: "After every meeting",
    when: "After every meeting.",
    days: [],
    connects: ["drive", "slack", "linear"],
    activity: [
      "Pulled 4 commitments from the notes",
      "Matched owners and dates",
      "Found 1 at risk",
    ],
    handles: [
      "Pulls commitments from meeting notes",
      "Tracks owners and due dates",
      "Nudges before things slip",
      "Brings blockers back to you",
    ],
  },
  {
    slug: "keep-our-launches-on-track",
    group: "move",
    title: "Keep our launches on track",
    summary: "Spot the missing pieces across product, marketing and support.",
    outcome: "Fewer last-minute surprises. One team ready to go.",
    context: "The release plan, shipped work, announcement assets, help docs and open approvals.",
    result:
      "A clear launch check, the missing help article drafted and the exact approvals still needed.",
    ask: "Keep our launches moving. Find the gaps before launch day does.",
    action: "Save the help article and ask the launch owner to review the remaining items?",
    schedule: "Every weekday until launch",
    when: "Every weekday until launch.",
    days: [0, 1, 2, 3, 4],
    connects: ["linear", "notion", "slack"],
    activity: ["Checked the launch plan", "Found a missing help article", "Wrote the first draft"],
    handles: [
      "Checks the launch plan every day",
      "Spots gaps across teams",
      "Drafts what’s missing",
      "Flags what needs you",
    ],
  },
  {
    slug: "walk-into-every-call-prepared",
    group: "move",
    title: "Walk into every call prepared",
    summary: "The history, the open promises and the questions worth asking.",
    outcome: "Pick up where the relationship left off.",
    context: "Past calls, recent conversations, account activity and commitments on both sides.",
    result:
      "A short pre-call brief with what changed, what was promised and the conversation to have next.",
    ask: "Before important customer calls, bring me up to speed and prepare the agenda.",
    action: "Add this agenda to the meeting and share it with the account team?",
    schedule: "30 min before every call",
    when: "30 minutes before every customer call.",
    days: [],
    connects: ["gmail", "hubspot", "linear"],
    activity: [
      "Read the last 3 conversations",
      "Checked what shipped since",
      "Listed open promises",
    ],
    handles: [
      "Reads the last conversations",
      "Checks what shipped since",
      "Lists open promises",
      "Suggests what to ask",
    ],
  },
  // Stay a step ahead
  {
    slug: "show-me-whats-driving-growth",
    group: "ahead",
    title: "Show me what’s driving growth",
    summary: "Connect the campaign to the customer. Find what deserves more attention.",
    outcome: "Know what is working beyond the top-line chart.",
    context:
      "Acquisition channels, campaigns, signups, activation and the customers who stick around.",
    result:
      "The channel bringing the right customers, a reason it is working and a concrete next experiment.",
    ask: "Every week, show me where our best customers are coming from and what to do more of.",
    action: "Turn this into next week’s growth plan and prepare the landing page?",
    schedule: "Every Mon · 9:00 AM",
    when: "Every Monday at 9:00 AM.",
    days: [0],
    connects: ["hubspot", "drive", "browser"],
    activity: [
      "Traced new teams to their first visit",
      "Compared channels",
      "Drafted the next page brief",
    ],
    handles: [
      "Traces customers to where they came from",
      "Compares channels that convert",
      "Spots what deserves more",
      "Drafts the next brief",
    ],
  },
  {
    slug: "keep-us-ahead-of-competitors",
    group: "ahead",
    title: "Keep us ahead of competitors",
    summary: "Notice the changes. Understand the angle. Be ready to respond.",
    outcome: "Stay informed without making research your Friday.",
    context:
      "Competitor pricing, new features, positioning and the objections your own team is hearing.",
    result:
      "A useful change, what it means for your company and an updated talking point for sales.",
    ask: "Watch our competitors and keep the team ready for what changes.",
    action: "Update the comparison sheet and share the new talking points with sales?",
    schedule: "Every Fri · 9:00 AM",
    when: "Every Friday at 9:00 AM.",
    days: [4],
    connects: ["browser", "notion", "slack"],
    activity: [
      "Checked 4 competitor sites",
      "Found a pricing change",
      "Updated the sales comparison",
    ],
    handles: [
      "Watches competitor sites",
      "Catches pricing and product changes",
      "Explains the angle",
      "Updates your sales comparison",
    ],
  },
  {
    slug: "keep-investors-in-the-loop",
    group: "ahead",
    title: "Keep investors in the loop",
    summary: "The numbers, the story and the asks. Without the monthly scramble.",
    outcome: "A clear company story, ready when it is time to share.",
    context:
      "Company metrics, shipped work, customer progress and the priorities for the next month.",
    result:
      "An investor update connecting the numbers to the wins, challenges and asks that matter.",
    ask: "Keep our monthly investor update ready, with the numbers, the progress and where we need help.",
    action: "Save this as the monthly update and prepare the email for your review?",
    schedule: "1st of every month · 9:00 AM",
    when: "On the 1st of every month at 9:00 AM.",
    days: [],
    connects: ["hubspot", "linear", "notion", "gmail"],
    activity: ["Pulled the month’s numbers", "Summarized what shipped", "Drafted it in your voice"],
    handles: [
      "Pulls the month’s numbers",
      "Summarizes what shipped",
      "Writes it in your voice",
      "Keeps the asks clear",
    ],
  },
];

/* ------------------------------------------------------------------ hero */

/** The things on your plate, as tasks that fold into Juno's hands. Each maps to a job above. */
export type TaskKind = "marketing" | "sales" | "team" | "meetings" | "investors" | "research";
export const heroTiles: { text: string; kind: TaskKind; label: string; note: string; late?: true; job: string }[] = [
  { text: "Post the launch blog", kind: "marketing", label: "Marketing", note: "Today", job: "keep-our-launches-on-track" },
  { text: "Find our next customers", kind: "sales", label: "Sales", note: "Monday", job: "find-our-next-customers" },
  { text: "Chase the launch copy", kind: "team", label: "Team", note: "Overdue", late: true, job: "keep-every-promise-moving" },
  { text: "Prep for the 10:00 call", kind: "meetings", label: "Meetings", note: "In 20 min", job: "walk-into-every-call-prepared" },
  { text: "Write the investor update", kind: "investors", label: "Investors", note: "Due on the 1st", job: "keep-investors-in-the-loop" },
  { text: "Check competitor pricing", kind: "research", label: "Research", note: "Friday", job: "keep-us-ahead-of-competitors" },
];
