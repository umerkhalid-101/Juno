import { AlertTriangle, Check, Download, Search } from "lucide-react";
import { Loadable, Sk } from "../Browser";
import { prog, typed, typingEnd, type Scenario } from "../kit";

/* --------------------------------------------------------------- brands */

const CloudMark = ({ s = 14 }: { s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden>
    <rect width="16" height="16" rx="4" fill="#3B5BDB" />
    <path d="M5 11h6.2a2.3 2.3 0 0 0 .3-4.6A3.2 3.2 0 0 0 5.4 6 2.5 2.5 0 0 0 5 11Z" fill="#fff" />
  </svg>
);
const GridMark = ({ s = 14 }: { s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden>
    <rect width="16" height="16" rx="4" fill="#D97706" />
    <path d="M4 5h8M4 8h8M4 11h8M7 4v8" stroke="#fff" strokeWidth="1.3" />
  </svg>
);

/* --------------------------------------------------------------- timing */

const URL = "billing.cloudhost.com/invoices";
const T = {
  url: 0.3,
  load: typingEnd(URL, 0.3) + 0.05,
  ready: 2.0,
  session: 1.7,
  filter: 2.4,
  select: 2.9,
  download: 3.4,
  dl: [3.6, 3.8, 4.0],
  toSheet: 4.5,
  match: 4.9,
  matchGap: 0.3,
  toCloud: 6.9,
  disputes: 7.3,
  fInvoice: 7.6,
  fReason: 8.05,
  fAmount: 9.25,
  submit: 9.8,
  ask: 9.9,
};
const REASON = "Charged twice on Oct 1 for the same plan";

/* --------------------------------------------------------------- CloudHost pages */

const invoices = [
  { id: "INV-1052", date: "Oct 15", desc: "Pro plan, Oct 15 to Nov 14", amt: "$1,980", oct: true },
  { id: "INV-1043", date: "Oct 1", desc: "Pro plan, Oct 1 to Oct 31", amt: "$2,140", oct: true },
  { id: "INV-1041", date: "Oct 1", desc: "Pro plan, Oct 1 to Oct 31", amt: "$2,140", oct: true },
  { id: "INV-1036", date: "Sep 15", desc: "Pro plan, Sep 15 to Oct 14", amt: "$1,980", oct: false },
  { id: "INV-1030", date: "Sep 1", desc: "Pro plan, Sep 1 to Sep 30", amt: "$2,140", oct: false },
];

function CloudSide({ active }: { active: string }) {
  return (
    <aside className="flex w-[168px] shrink-0 flex-col gap-0.5 border-r border-black/[0.06] bg-[#F8F9FB] p-3 text-[13px]">
      <span className="mb-4 flex items-center gap-2 px-2 pt-1 text-[14px] font-semibold tracking-[-0.01em]">
        <CloudMark s={18} />
        CloudHost
      </span>
      {["Overview", "Usage", "Invoices", "Payment methods", "Disputes"].map((n) => (
        <span
          key={n}
          data-c={n === "Disputes" ? "nav-disputes" : undefined}
          className={`rounded-md px-2 py-1.5 ${n === active ? "bg-[#E7ECFF] font-medium text-[#2B44C4]" : "text-[#4b515c]"}`}
        >
          {n}
        </span>
      ))}
      <span className="mt-auto rounded-lg bg-white p-2.5 text-[12px] text-[#5d6370] ring-1 ring-black/[0.06]">
        Pro plan
        <span className="block font-medium text-[#16181d]">Northline Labs</span>
      </span>
    </aside>
  );
}

function Invoices({ t }: { t: number }) {
  const oct = t >= T.filter;
  const sel = t >= T.select;
  const rows = invoices.filter((r) => !oct || r.oct);
  return (
    <div className="flex h-full">
      <CloudSide active="Invoices" />
      <main className="min-w-0 flex-1 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[19px] font-semibold tracking-[-0.02em]">Invoices</p>
            <p className="mt-0.5 text-[13px] text-[#5d6370]">Billed monthly to the card ending 4242</p>
          </div>
          <span
            data-c="download"
            className={`inline-flex h-[32px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors ${
              sel ? "bg-[#3B5BDB] text-white" : "bg-white text-[#16181d] ring-1 ring-black/10"
            } ${t >= T.download && t < T.download + 0.18 ? "scale-[0.97]" : ""}`}
          >
            <Download size={14} aria-hidden />
            {sel ? "Download 3" : "Download"}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[13px]">
          {["All", "October 2026", "September 2026"].map((f) => {
            const on = (f === "All" && !oct) || (f === "October 2026" && oct);
            return (
              <span
                key={f}
                data-c={f === "October 2026" ? "oct-filter" : undefined}
                className={`rounded-full px-3 py-1 ${on ? "bg-[#16181d] text-white" : "bg-[#F1F2F5] text-[#4b515c]"}`}
              >
                {f}
              </span>
            );
          })}
          <span className="ml-auto inline-flex items-center gap-1.5 text-[#8a909c]">
            <Search size={13} aria-hidden />
            Search invoices
          </span>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-black/[0.07]">
          <div className="grid grid-cols-[34px_92px_70px_1fr_80px_64px] items-center bg-[#F8F9FB] px-3 py-2 text-[12px] font-medium text-[#6b717d]">
            <span data-c="select-all" className={`grid size-[15px] place-items-center rounded-[4px] ${sel ? "bg-[#3B5BDB] text-white" : "ring-1 ring-black/20"}`}>
              {sel && <Check size={11} strokeWidth={3} aria-hidden />}
            </span>
            <span>Invoice</span>
            <span>Date</span>
            <span>Period</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Status</span>
          </div>
          {rows.map((r) => (
            <div
              key={r.id}
              className={`grid grid-cols-[34px_92px_70px_1fr_80px_64px] items-center border-t border-black/[0.05] px-3 py-2.5 text-[13px] ${sel ? "bg-[#F4F6FF]" : ""}`}
            >
              <span className={`grid size-[15px] place-items-center rounded-[4px] ${sel ? "bg-[#3B5BDB] text-white" : "ring-1 ring-black/20"}`}>
                {sel && <Check size={11} strokeWidth={3} aria-hidden />}
              </span>
              <span className="font-medium">{r.id}</span>
              <span className="text-[#4b515c]">{r.date}</span>
              <span className="truncate text-[#4b515c]">{r.desc}</span>
              <span className="text-right tabular-nums">{r.amt}</span>
              <span className="text-right">
                <span className="rounded-full bg-[#E9F7EF] px-2 py-0.5 text-[11.5px] font-medium text-[#1f7a4d]">Paid</span>
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, focus, multiline, c }: { label: string; value: string; focus: boolean; multiline?: boolean; c: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-[#4b515c]">{label}</span>
      <span
        data-c={c}
        className={`block rounded-lg bg-white px-3 text-[13.5px] ${multiline ? "h-[64px] py-2" : "flex h-[36px] items-center"} ${
          focus ? "ring-2 ring-[#3B5BDB]/60" : "ring-1 ring-black/15"
        }`}
      >
        {value}
        {focus && <span className="caret ml-px inline-block h-[15px] w-px translate-y-[3px] bg-[#16181d]" />}
      </span>
    </label>
  );
}

function Disputes({ t }: { t: number }) {
  const inv = typed("INV-1043", t, T.fInvoice + 0.05, 26);
  const reason = typed(REASON, t, T.fReason + 0.05, 40);
  const amt = typed("$2,140", t, T.fAmount + 0.05, 26);
  const focus = t < T.fReason ? "inv" : t < T.fAmount ? "reason" : t < T.submit ? "amt" : "";
  return (
    <div className="flex h-full">
      <CloudSide active="Disputes" />
      <main className="min-w-0 flex-1 p-5">
        <p className="text-[19px] font-semibold tracking-[-0.02em]">Open a dispute</p>
        <p className="mt-0.5 text-[13px] text-[#5d6370]">We reply within 2 business days.</p>
        <div className="mt-5 max-w-[440px] space-y-4">
          <Field c="f-invoice" label="Invoice" value={inv} focus={focus === "inv"} />
          <Field c="f-reason" label="What went wrong" value={reason} focus={focus === "reason"} multiline />
          <Field c="f-amount" label="Amount to refund" value={amt} focus={focus === "amt"} />
          <div className="flex gap-2 pt-1">
            <span data-c="submit" className="inline-flex h-[34px] items-center rounded-lg bg-[#3B5BDB] px-4 text-[13px] font-medium text-white">
              Submit dispute
            </span>
            <span className="inline-flex h-[34px] items-center rounded-lg px-3 text-[13px] text-[#4b515c]">Cancel</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function CloudSkeleton() {
  return (
    <div className="flex h-full">
      <div className="w-[168px] shrink-0 space-y-3 border-r border-black/[0.06] bg-[#F8F9FB] p-4">
        <Sk className="h-5 w-24" />
        {[0, 1, 2, 3, 4].map((i) => (
          <Sk key={i} className="h-4 w-28" />
        ))}
      </div>
      <div className="flex-1 space-y-4 p-5">
        <Sk className="h-6 w-40" />
        <Sk className="h-4 w-64" />
        <Sk className="h-[180px] w-full" />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Gridline sheet */

const charges = [
  { d: "Oct 1", who: "CLOUDHOST*PRO", amt: "$2,140", m: "INV-1041" },
  { d: "Oct 1", who: "CLOUDHOST*PRO", amt: "$2,140", m: "dup" },
  { d: "Oct 3", who: "FIGMENT STUDIO", amt: "$480", m: "Receipt" },
  { d: "Oct 15", who: "CLOUDHOST*PRO", amt: "$1,980", m: "INV-1052" },
  { d: "Oct 18", who: "NORTHLINE AIR", amt: "$612", m: "Receipt" },
  { d: "Oct 22", who: "OFFICE SUPPLY CO", amt: "$86", m: "Receipt" },
  { d: "Oct 24", who: "STACKWISE", amt: "$240", m: "Receipt" },
];

function Sheet({ t }: { t: number }) {
  const checked = Math.floor((t - T.match) / T.matchGap) + 1;
  const scanning = t >= T.match && checked <= charges.length;
  const total = Math.round(prog(t, T.match, T.toCloud - 0.3) * 41);
  return (
    <div className="flex h-full flex-col text-[13px]">
      <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-2">
        <GridMark s={18} />
        <span className="font-medium">October charges</span>
        <span className="flex gap-3 text-[12.5px] text-[#6b717d]">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Data</span>
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#FAFAFB] px-4 py-1.5 font-mono text-[12px] text-[#4b515c]">
        <span className="text-[#8a909c]">fx</span>
        =MATCH(C{Math.min(charges.length, Math.max(1, checked)) + 1}, Invoices!B:B, 0)
      </div>
      <div className="grid grid-cols-[36px_70px_1fr_80px_1.3fr] bg-[#F4F5F7] text-[11.5px] text-[#8a909c]">
        {["", "A", "B", "C", "D"].map((c, i) => (
          <span key={i} className="border-r border-black/[0.06] px-2 py-1 text-center">
            {c}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[36px_70px_1fr_80px_1.3fr] border-b border-black/[0.06] font-medium">
        <span className="bg-[#F4F5F7] px-2 py-2 text-center text-[11.5px] text-[#8a909c]">1</span>
        <span className="px-2 py-2">Date</span>
        <span className="px-2 py-2">Bank charge</span>
        <span className="px-2 py-2 text-right">Amount</span>
        <span className="px-2 py-2">Matched to</span>
      </div>
      {charges.map((r, i) => {
        const done = t >= T.match && i < checked;
        const now = scanning && i === checked - 1;
        const dup = r.m === "dup";
        return (
          <div
            key={i}
            className={`grid grid-cols-[36px_70px_1fr_80px_1.3fr] items-center border-b border-black/[0.05] transition-colors duration-150 ${
              done && dup ? "bg-[#FDECEC]" : now ? "bg-[#EEF2FF]" : ""
            }`}
          >
            <span className="bg-[#F4F5F7] px-2 py-2 text-center text-[11.5px] text-[#8a909c]">{i + 2}</span>
            <span className="px-2 py-2 text-[#4b515c]">{r.d}</span>
            <span className="truncate px-2 py-2 font-mono text-[12px]">{r.who}</span>
            <span className="px-2 py-2 text-right tabular-nums">{r.amt}</span>
            <span className="px-2 py-2">
              {done &&
                (dup ? (
                  <span className="pop-in inline-flex items-center gap-1 rounded-md bg-[#FF6568]/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[#C22F32]">
                    <AlertTriangle size={11} aria-hidden />
                    Duplicate charge · $2,140
                  </span>
                ) : (
                  <span className="pop-in inline-flex items-center gap-1.5 text-[#1f7a4d]">
                    <Check size={13} strokeWidth={2.5} aria-hidden />
                    {r.m}
                  </span>
                ))}
            </span>
          </div>
        );
      })}
      <div className="px-4 py-2 text-[12.5px] text-[#8a909c]">+ 35 more rows</div>
      <div className="mt-auto flex items-center justify-between border-t border-black/[0.06] bg-[#FAFAFB] px-4 py-2 text-[12.5px] text-[#4b515c]">
        <span>Sheet 1 of 2</span>
        <span className="tabular-nums">
          Matched <span className="font-medium text-[#16181d]">{t >= T.match ? Math.min(41, total) : 0}</span> of 42 charges
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- scenario */

export const reconcile: Scenario = {
  id: "reconcile",
  tab: "Reconcile a bill",
  duration: 13,
  askAt: T.ask,
  approval: "Submit a $2,140 dispute for the double charge?",
  log: [
    { at: T.session, text: "Signed in to CloudHost (no API, using the site)" },
    { at: T.download, done: T.dl[2] + 0.2, text: "Downloaded 3 October invoices" },
    {
      at: T.match,
      done: T.toCloud - 0.3,
      text: "Matched 41 bank charges",
      live: (t) => `Matching bank charges · ${Math.min(41, Math.round(prog(t, T.match, T.toCloud - 0.3) * 41))}/41`,
    },
    { at: T.match + T.matchGap * 2, done: T.match + T.matchGap * 2 + 0.4, text: "Found a duplicate charge: $2,140 on Oct 1" },
    { at: T.fInvoice, done: T.submit, text: "Drafted a dispute for INV-1043" },
  ],
  cursor: [
    { at: T.filter, target: "oct-filter", click: true },
    { at: T.select, target: "select-all", click: true },
    { at: T.download, target: "download", click: true },
    { at: T.toSheet, target: "tab-1", click: true },
    { at: T.match + 0.6, target: "sheet-area" },
    { at: T.toCloud, target: "tab-0", click: true },
    { at: T.disputes, target: "nav-disputes", click: true },
    { at: T.fInvoice, target: "f-invoice", click: true },
    { at: T.fReason, target: "f-reason", click: true },
    { at: T.fAmount, target: "f-amount", click: true },
    { at: T.submit, target: "submit" },
  ],
  chrome: (t) => {
    const sheet = t >= T.toSheet && t < T.toCloud;
    const dls = ["INV-1041.pdf", "INV-1043.pdf", "INV-1052.pdf"].filter((_, i) => t >= T.dl[i]);
    const page = t >= T.disputes ? "billing.cloudhost.com/disputes/new" : URL;
    return {
      tabs: [
        { title: "Invoices · CloudHost", icon: <CloudMark />, active: !sheet },
        { title: "October charges", icon: <GridMark />, active: sheet },
      ],
      url: sheet ? "gridline.com/s/october-charges" : t < T.load ? typed(URL, t, T.url) : page,
      typing: t < T.load,
      loading: t >= T.load && t < T.ready,
      session: t >= T.session,
      downloads: dls,
    };
  },
  Page: ({ t }) => {
    if (t >= T.toSheet && t < T.toCloud)
      return (
        <div data-c="sheet-area" className="h-full">
          <Sheet t={t} />
        </div>
      );
    return (
      <Loadable ready={t >= T.ready} skeleton={t >= T.load ? <CloudSkeleton /> : <div className="h-full bg-white" />}>
        {t >= T.disputes ? <Disputes t={t} /> : <Invoices t={t} />}
      </Loadable>
    );
  },
};

