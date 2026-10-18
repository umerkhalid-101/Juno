/**
 * The Privacy policy and Terms of service, verbatim from runjuno.ai/privacy and /terms
 * (last updated October 2, 2026). Bold lead-ins are kept as `lead`.
 */

export type Block = { p: string } | { ul: { lead?: string; text: string }[] };
export type Section = { id: string; title: string; blocks: Block[] };
export type LegalDoc = {
  slug: "privacy" | "terms";
  title: string;
  /** the word drawn in the gradient */
  word: string;
  sub: string;
  updated: string;
  meta: { title: string; description: string };
  sections: Section[];
};

export const CONTACT_EMAIL = "info@runjuno.ai";

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy",
  word: "policy",
  sub: "How we handle the information you share with Juno and the choices you have.",
  updated: "October 2, 2026",
  meta: {
    title: "Privacy Policy | Juno",
    description:
      "Read how Juno collects, uses, stores and shares information across its website, apps and connected services, and learn about your privacy choices.",
  },
  sections: [
    {
      id: "about",
      title: "About this policy",
      blocks: [
        {
          p: "Juno is operated by Mailmunch, Inc. (“we,” “us,” or “our”). This Privacy Policy explains how we handle personal information when you visit our website, create an account, or use our apps and services. Our Terms of Service also apply to your use of Juno.",
        },
        {
          p: "When an organization provides information through its workspace, it determines why that information is used. We process it to provide the service on the organization’s behalf. Its policies and agreements with us may also apply to your use of the workspace.",
        },
      ],
    },
    {
      id: "information",
      title: "Information we collect",
      blocks: [
        {
          ul: [
            { lead: "Account information.", text: "Your name, email address, profile image, sign-in details, and workspace membership, including profile and authentication information shared by a sign-in provider." },
            { lead: "Your content.", text: "Messages, instructions, files, images, feedback, and other information you or your workspace members submit, together with the responses and work Juno produces." },
            { lead: "Connected services.", text: "Information available through accounts and tools you authorize, such as messages, contacts, documents, tasks, meeting records, and business records. What is available depends on the connection and its permissions." },
            { lead: "Connection credentials.", text: "Authorization tokens and, for connected browser accounts, saved session information needed to access the services you connect." },
            { lead: "Public information.", text: "Content from websites and other sources you ask Juno to read or that are relevant to your work." },
            { lead: "Usage and technical information.", text: "IP addresses, device and browser details, session activity, feature usage, errors, and records of tasks and actions." },
            { lead: "Communications.", text: "Information you provide when you contact us for help or discuss your account with us." },
          ],
        },
      ],
    },
    {
      id: "use",
      title: "How we use information",
      blocks: [
        { p: "We use information to:" },
        {
          ul: [
            { text: "Administer accounts, authenticate users, and manage access." },
            { text: "Build searchable company knowledge, answer questions, generate files, and carry out the tasks and routines you configure." },
            { text: "Read from and act in connected services according to your instructions and the access available to Juno." },
            { text: "Remember relevant context, preferences, and feedback in your workspace." },
            { text: "Operate, troubleshoot, secure, and improve the service, including understanding usage and investigating errors or misuse." },
            { text: "Respond to requests, send account and service communications, and meet legal obligations." },
          ],
        },
        {
          p: "Where data protection law requires a legal basis, we rely on performing our contract with you, our legitimate interests in operating and securing the service, compliance with legal obligations, or your consent, as appropriate to the activity. You can withdraw consent where we rely on it.",
        },
      ],
    },
    {
      id: "ai",
      title: "AI and connected services",
      blocks: [
        {
          p: "Juno uses external AI and infrastructure services to process requests. Relevant messages, files, company knowledge, and tool results may be sent to these services to generate answers, create content, and complete work. Information you include in a request may therefore be processed outside Juno’s own systems.",
        },
        {
          p: "Some connections import and store information for later use. Others access information when needed. If you authorize an action, relevant information may be sent to the service or recipient involved. Routines may perform work while you are offline, according to their settings.",
        },
        {
          p: "You can manage connections in Juno or revoke access through the connected service. Revoking access does not automatically erase previously imported information or undo completed actions. Connected services also handle information under their own policies.",
        },
      ],
    },
    {
      id: "sharing",
      title: "When information is shared",
      blocks: [
        {
          ul: [
            { lead: "Within your workspace.", text: "Content is available according to workspace permissions and sharing settings. Administrators can manage membership and access." },
            { lead: "With service providers.", text: "We use providers for hosting, storage, authentication, email delivery, AI processing, browser sessions, and other functions needed to operate Juno." },
            { lead: "At your direction.", text: "When you share content, publish a file, send a message, or authorize work in another service, information is shared with the audience or service involved. Public content may be accessible to anyone with its link and may be copied by others." },
            { lead: "For legal and security reasons.", text: "We may disclose information to comply with applicable law or valid legal process, protect people and systems, investigate misuse, or enforce our agreements." },
            { lead: "In a business transfer.", text: "Information may be disclosed as part of a merger, acquisition, financing, reorganization, or sale of assets, subject to applicable confidentiality and data protection requirements." },
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      blocks: [
        {
          p: "Juno uses cookies and similar storage to maintain sign-in sessions, support authentication, and remember interface preferences. Our apps may store session information on your device so you can stay signed in.",
        },
        {
          p: "You can control cookies through your browser and clear stored data from your browser or device. Removing or blocking session storage may sign you out or prevent parts of Juno from working.",
        },
      ],
    },
    {
      id: "retention",
      title: "Retention and deletion",
      blocks: [
        {
          p: "Retention depends on the information’s purpose, your workspace’s use of the service, and legal, security, and operational requirements. Workspace content and saved context can remain available until deleted by someone with the necessary permissions or through a deletion request.",
        },
        {
          p: "Deletion from active systems may not immediately remove every copy from backups or operational logs. Information may also need to be retained to meet legal obligations, resolve disputes, or investigate security issues. Copies exported, published, or sent to third parties are subject to those recipients’ controls and retention practices.",
        },
      ],
    },
    {
      id: "security",
      title: "Security and international processing",
      blocks: [
        {
          p: "Juno uses authentication and access controls to restrict access to accounts and workspace information. No system is completely secure. Protect your credentials and carefully choose what information to connect, upload, or share.",
        },
        {
          p: "Juno and its service providers may process information in countries other than the one where you live, where data protection laws may differ. Where required, transfers are subject to the safeguards required by applicable data protection law.",
        },
      ],
    },
    {
      id: "choices",
      title: "Your choices and rights",
      blocks: [
        {
          p: "You can update account information, manage connections, and use available sharing and deletion controls. If you use Juno through an organization, contact its administrator about workspace content and access.",
        },
        {
          p: "Depending on where you live, you may have rights to request access to, correction of, deletion of, or a portable copy of your personal information; object to or restrict certain processing; and withdraw consent where processing relies on it. You may also have the right to complain to your local data protection authority.",
        },
        {
          p: "Contact us to make a request. We may need to verify your identity and authority before responding. For information processed on behalf of an organization, we may direct your request to that organization.",
        },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        {
          p: "Juno is a business service intended for adults and is not directed to children under 18. If you believe a child has provided personal information to Juno, contact us so we can investigate and address it.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          p: "We may update this policy as Juno or our practices change. The date above identifies the latest version. We will provide additional notice of material changes and obtain consent where required by applicable law.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          p: "For privacy questions or requests about your personal information, contact Mailmunch, Inc. at info@runjuno.ai. For requests about an organization’s workspace, you can also contact its administrator.",
        },
      ],
    },
  ],
};

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of",
  word: "service",
  sub: "The terms that apply when you use Juno, connect your tools, and put Juno to work.",
  updated: "October 2, 2026",
  meta: {
    title: "Terms of Service | Juno",
    description:
      "Read the terms for using Juno’s website, apps and services, including accounts, connected tools, generated content, acceptable use and responsibilities.",
  },
  sections: [
    {
      id: "agreement",
      title: "Your agreement with Juno",
      blocks: [
        {
          p: "These Terms of Service (“Terms”) govern your access to and use of Juno’s website, apps, and services (“Juno” or the “Service”). By using the Service, you agree to these Terms. If you do not agree, do not use the Service.",
        },
        {
          p: "Juno is operated by Mailmunch, Inc. (“we,” “us,” or “our”), with whom you enter into this agreement. “You” means the person using the Service or the organization on whose behalf that person acts. If you use Juno for an organization, you represent that you have authority to accept these Terms for it. A separate written agreement with us controls to the extent it conflicts with these Terms.",
        },
      ],
    },
    {
      id: "accounts",
      title: "Eligibility and accounts",
      blocks: [
        {
          p: "You must be at least 18 and legally able to enter into this agreement. Provide accurate account information, keep it current, and protect your credentials. You are responsible for activity under your account and for notifying us if you believe it has been compromised.",
        },
        {
          p: "Workspace owners and administrators manage membership, permissions, and shared connections. Your access to an organization’s workspace is subject to its settings and policies.",
        },
      ],
    },
    {
      id: "using",
      title: "Using Juno",
      blocks: [
        {
          p: "Juno helps you work with company knowledge, create content, and complete tasks across connected services. Subject to these Terms, you may access and use the Service for lawful personal or business purposes.",
        },
        {
          p: "Features may change or be unavailable from time to time. Preview, experimental, or beta features may be incomplete and may be changed or discontinued. Keep independent copies of information you need to preserve.",
        },
      ],
    },
    {
      id: "connections",
      title: "Connections, actions, and routines",
      blocks: [
        {
          p: "Only connect accounts and provide information you are authorized to use. By connecting a service, you authorize Juno to access it within the permissions granted and process information needed for your use of Juno. You remain responsible for complying with that service’s terms.",
        },
        {
          p: "Juno can affect other systems by creating or changing records, sending messages, or publishing content. You are responsible for the instructions, permissions, and approvals you provide. Review the destination and content of consequential actions before authorizing them.",
        },
        {
          p: "Enabled routines may run while you are offline according to their permissions and approval settings. Review those settings and pause work you no longer want. Disconnecting an account or stopping a routine does not undo completed actions or necessarily stop work already accepted by another service.",
        },
      ],
    },
    {
      id: "content",
      title: "Your content and generated output",
      blocks: [
        {
          p: "You retain your rights in the content you provide (“Your Content”). You grant us permission to host, copy, process, transmit, and display Your Content as needed to provide and secure the Service, carry out your instructions, and comply with applicable law. This includes processing by service providers needed to deliver Juno.",
        },
        {
          p: "You are responsible for having the rights and permissions needed to submit Your Content and instruct Juno to use it. Do not upload or share information in a way that violates others’ rights or your confidentiality obligations.",
        },
        {
          p: "As between you and Mailmunch, Inc., to the extent permitted by law, you own the output generated for you. We assign to you any rights we may have in that output. Output may not be unique, may not qualify for intellectual property protection, and may include material subject to third-party rights. These Terms do not transfer ownership of the Service, its software, or Juno’s branding.",
        },
      ],
    },
    {
      id: "review",
      title: "AI limitations and your review",
      blocks: [
        {
          p: "AI-generated output can be inaccurate, incomplete, or unsuitable for your purpose, even when presented confidently. Review output and check important facts before relying on, sharing, or acting on it.",
        },
        {
          p: "Juno does not provide professional legal, medical, financial, or other regulated advice. Use qualified professionals when needed. Do not rely on Juno as the sole basis for decisions that could materially affect a person’s rights, health, safety, or access to essential services.",
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      blocks: [
        { p: "You must not use Juno to:" },
        {
          ul: [
            { text: "Break the law, infringe intellectual property rights, or violate another person’s privacy or confidentiality." },
            { text: "Commit fraud, impersonate others deceptively, distribute malware, send unlawful spam, or facilitate harassment or abuse." },
            { text: "Access accounts, systems, or data without authorization." },
            { text: "Bypass access controls, approval requirements, security measures, usage limits, or connected-service restrictions." },
            { text: "Interfere with the Service, test it destructively without permission, or use it in a way that harms other users." },
          ],
        },
        {
          p: "You must not reverse engineer the Service except where applicable law gives you a right to do so that cannot be restricted by agreement.",
        },
      ],
    },
    {
      id: "fees",
      title: "Fees and third-party services",
      blocks: [
        {
          p: "If you purchase a paid offering, its pricing, billing period, usage limits, and renewal or cancellation terms will be provided when you purchase it or in a separate agreement. You agree to pay the fees you accept and applicable taxes. These Terms do not create a paid subscription by themselves.",
        },
        {
          p: "Third-party services may charge their own fees and have their own terms. We do not control their availability, content, or practices. You are responsible for charges you authorize through those services.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      blocks: [
        {
          p: "Our Privacy Policy explains how we handle personal information. You are responsible for providing required notices and obtaining required permissions before submitting other people’s personal information or instructing Juno to process it.",
        },
      ],
    },
    {
      id: "termination",
      title: "Suspension and termination",
      blocks: [
        {
          p: "You can stop using Juno at any time. Stopping use does not by itself cancel a routine, revoke a connection, delete workspace data, or cancel a separate paid agreement. Use the relevant controls or contact us for help.",
        },
        {
          p: "We may suspend or end access if you materially violate these Terms, create a security or legal risk, or fail to pay agreed fees. We may also discontinue the Service. Where reasonably possible, we will give notice and an opportunity to address the issue or retrieve your content.",
        },
        {
          p: "After termination, your right to use the Service ends. Provisions that by their nature should survive, including accrued payment obligations, ownership, disclaimers, and limitations of liability, continue to apply.",
        },
      ],
    },
    {
      id: "liability",
      title: "Disclaimers and liability",
      blocks: [
        {
          p: "To the extent permitted by law, the Service is provided “as is” and “as available.” We do not warrant that it will be uninterrupted, error-free, or that output will be accurate or suitable for a particular purpose. We disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement to the extent permitted by law.",
        },
        {
          p: "To the extent permitted by law, Mailmunch, Inc. will not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, revenue, business opportunities, or goodwill arising from your use of the Service.",
        },
        {
          p: "Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited, or removes mandatory consumer rights under applicable law.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes and general terms",
      blocks: [
        {
          p: "We may update these Terms as the Service changes. We will post revised Terms here, update the date above, and provide notice of material changes before they take effect where required by law. If you do not agree to revised Terms, stop using the Service. Continued use after revised Terms take effect constitutes acceptance to the extent permitted by law.",
        },
        {
          p: "If a provision is unenforceable, the remaining provisions continue in effect. A failure to enforce a provision is not a waiver of the right to enforce it later. These Terms and any applicable separate written agreement form the agreement between you and Mailmunch, Inc. for the Service.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [{ p: "For questions about these Terms or your account, contact Mailmunch, Inc. at info@runjuno.ai." }],
    },
  ],
};
