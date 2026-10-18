/**
 * The Apps page (/apps). Copy is verbatim from runjuno.ai/apps, with the site's cast swapped in
 * (Leo and Emma in the launch room, Leo as Alex's buddy). [new] marks words added for this design.
 */

export const apps = {
  meta: {
    title: "AI App & Website Builder with Built-in CMS | Juno",
    description:
      "Build custom apps, dashboards, a full website and a blog with Juno. Use your company context and brand, with a built-in CMS and custom domains.",
  },

  hero: {
    lead: "The app your team",
    muted: "wishes it had.",
    sub: "Describe it. Juno builds it around your company, your brand and the way you work.",
    secondary: "See what you could build",
    another: "Try another", // [new]
    /**
     * What the hero builds. The first is verbatim from the live page (with the site's cast);
     * the other two are [new]. In each prompt, three phrases lift out and become the app's
     * title, subtitle and list.
     */
    builds: [
      {
        id: "launch",
        label: "Requests tracker",
        prompt: [
          { t: "Build us a " },
          { t: "tracker", to: "title" },
          { t: " for " },
          { t: "customer requests", to: "list" },
          { t: ". Who asked, how often and " },
          { t: "what we’re doing about it", to: "sub" },
          { t: "." },
        ],
        reply: "Every request in one place. Nobody left waiting.",
        url: "requests.yourcompany.com",
        title: "Requests",
        chip: "Customer requests",
        name: "What customers are asking for",
        sub: "Who asked, how often and what we’re doing about it.",
        stat: "Customers answered",
        rows: [
          { task: "Export to CSV", meta: "12 customers", tag: "Planned" },
          { task: "Single sign-on", meta: "9 customers", tag: "Building" },
          { task: "Weekly digest email", meta: "6 customers", tag: "Shipped" },
          { task: "Custom date ranges", meta: "4 customers", tag: "Replied" },
        ],
        tag: "Replied",
        action: "Reply",
        note: "Four customers are waiting on you.",
        done: "Everyone has heard back. Nice work.",
        when: "This week",
      },
      {
        id: "ideas",
        label: "Ideas board",
        prompt: [
          { t: "Make " },
          { t: "a board", to: "title" },
          { t: " where " },
          { t: "customers vote", to: "list" },
          { t: " on " },
          { t: "what we build next", to: "sub" },
          { t: "." },
        ],
        reply: "Customers get a say. You get a clear next step.",
        url: "ideas.yourcompany.com",
        title: "Ideas board",
        chip: "Customer feedback",
        name: "What should we make next?",
        sub: "What we build next, decided together.",
        stat: "Ideas reviewed",
        rows: [
          { task: "Shareable reports", meta: "24 votes" },
          { task: "Custom dashboard", meta: "18 votes" },
          { task: "Dark mode", meta: "12 votes" },
          { task: "Slack alerts", meta: "9 votes" },
        ],
        tag: "Planned",
        action: "Review",
        note: "One new idea is waiting for you.",
        done: "All caught up. Customers can see it.",
        when: "This week",
      },
      {
        id: "welcome",
        label: "Welcome page",
        prompt: [
          { t: "Build " },
          { t: "a welcome page", to: "title" },
          { t: ". " },
          { t: "Everything Alex needs", to: "list" },
          { t: " for " },
          { t: "a great first week", to: "sub" },
          { t: "." },
        ],
        reply: "Alex walks in knowing exactly where to start.",
        url: "welcome.yourcompany.com",
        title: "Welcome aboard",
        chip: "Alex’s first week",
        name: "Hey Alex. You’re one of us.",
        sub: "A great first week, all in one place.",
        stat: "Steps done",
        rows: [
          { task: "Laptop and accounts", meta: "Sam" },
          { task: "Meet your buddy", meta: "Leo" },
          { task: "Team lunch", meta: "Emma" },
          { task: "Share your first idea", meta: "You" },
        ],
        tag: "Done",
        action: "Mark done",
        note: "One step to go.",
        done: "Week one, done.",
        when: "Monday",
      },
    ],
  },

  website: {
    lead: "Your whole website.",
    muted: "Built with Juno.",
    sub: "A full website. A beautiful blog. A built-in CMS. All in your brand.",
    note: "Multiple pages. Your own domain. Made to feel like you.",
    url: "everydayobjects.com",
    home: {
      kicker: "Thoughtfully chosen. Everyday loved.",
      title: "A little more",
      italic: "lovely.",
      sub: "Considered objects for the spaces and moments that make a life.",
      cta: "Meet Everyday Objects",
      inspo: "A little inspiration",
      footer: "Beautifully simple. Simply useful. Made for the everyday.",
    },
    // [new] placeholder about page, built from the same brand
    story: {
      title: "Made for the",
      italic: "everyday.",
      body: "We started with one lamp and a simple idea: the things you use every day should be a pleasure to live with. Every piece is chosen slowly, made well and meant to stay.",
    },
    journal: "The Everyday Journal",
    posts: [
      { id: "slow", tag: "Spaces", title: "A little room", italic: "to slow down.", line: "A softer light. A favorite corner. A moment that’s yours." },
      { id: "home", tag: "Everyday rituals", title: "The joy of making", italic: "yourself at home.", line: "Small rituals that turn a house into a home." }, // line [new]
    ],
    cms: {
      title: "A built-in CMS",
      section: "Content",
      list: "Blog posts",
      ready: "Image, story and URL. All ready.",
      blog: "A blog worth reading",
      live: "Live on your website",
    },
  },

  dock: {
    lead: "Small apps.",
    muted: "Big things off your plate.",
    sub: "For your customers. For your team. For that idea you keep coming back to.",
    try: "Try the idea",
    apps: [
      {
        id: "portal",
        name: "Customer portal",
        headline: "Fewer “any updates?” emails.",
        body: "Give customers one place for progress, files and approvals. Give your team its focus back.",
      },
      {
        id: "feedback",
        name: "Feedback board",
        headline: "Turn “we should” into what’s next.",
        body: "Give requests a home, let people weigh in and show customers what’s moving forward.",
      },
      {
        id: "onboarding",
        name: "Team onboarding",
        headline: "A great first week. For everyone.",
        body: "The right people, guides and first steps, together. Less repeating yourself. More feeling at home.",
      },
      {
        id: "roi",
        name: "ROI calculator",
        headline: "Let the value speak for itself.",
        body: "Turn a sales explanation into something a prospect can try, with numbers that reflect their business.",
      },
      {
        id: "help",
        name: "Help center",
        headline: "Your best answers. Always handy.",
        body: "A branded home for guides and answers, with a built-in CMS your team can keep up to date.",
      },
      {
        id: "launch",
        name: "Launch site",
        headline: "Give your next idea a first customer.",
        body: "A page worth sharing, a clear story and a place to sign up. Go from talking about it to putting it out there.",
      },
    ],
  },

  made: {
    lead: "Your company.",
    muted: "Built right in.",
    sub: "The difference between another tool and one that feels like yours.",
    look: { title: "Your look. Your voice.", line: "Your brand, carried from the first screen to the last detail." },
    work: { title: "A place for real work.", line: "Built around the company context, data and content Juno already has.", from: "Customer requests", to: "Your team’s app" },
    open: { title: "An idea you can open.", line: "Preview it, refine it with Juno and publish it on a domain of your own.", url: "ideas.yourcompany.com" },
  },

  more: {
    lead: "“One more thing…”",
    muted: "is all it takes.",
    sub: "Add a view. Change the flow. Make room for a new idea. Keep building in the same conversation.",
    chips: [
      { ask: "Can we add a place for customers to approve the design?", reply: "Absolutely. Right where they need it." },
      { ask: "Add a Files tab with the latest uploads.", reply: "Done. Files are in." }, // [new]
      { ask: "Show the launch date at the top.", reply: "Added. Right under the title." }, // [new]
    ],
  },

  faq: {
    title: "A few good",
    muted: "questions.",
    items: [
      {
        q: "Does my app have to look like one of these?",
        a: "Start with the problem you want to solve. These are ideas to spark your own. Describe who the app is for, what they need to do and what would make their day easier.",
      },
      {
        q: "Do I need to know how to code?",
        a: "You describe the idea. Juno creates the app and a preview you can try. Ask for changes in the conversation until it works the way you want.",
      },
      {
        q: "Can it use our brand and content?",
        a: "Juno already knows your brand and company, so what it builds feels like yours. The built-in CMS makes your content easy to manage.",
      },
      {
        q: "What happens when it’s ready?",
        a: "Review the preview with Juno, then ask it to publish. You can connect a custom domain and come back to the conversation when you want to change something.",
      },
    ],
  },

  close: {
    lead: "What’s the app",
    muted: "you wish you had?",
  },
} as const;

export type AppId = (typeof apps.dock.apps)[number]["id"];
