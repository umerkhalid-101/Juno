import Image from "next/image";
import { Check, ChevronDown, MapPin, Search, Star, Users } from "lucide-react";
import { Loadable, Sk } from "../Browser";
import { typed, typingEnd, unsplash, type Scenario } from "../kit";

const Sun = ({ s = 14 }: { s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden>
    <rect width="16" height="16" rx="4" fill="#E4572E" />
    <path d="M3.5 11a4.5 4.5 0 0 1 9 0" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M3 12.5h10" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const URL = "retreatly.example";
const QUERY = "Lisbon · Oct 24 to 25 · 20 people";
const T = {
  url: 0.3,
  load: typingEnd(URL, 0.3) + 0.05,
  ready: 1.45,
  session: 1.2,
  search: 1.8,
  type: 1.85,
  go: 3.1,
  results: 3.7,
  cap: 4.0,
  capPick: 4.45,
  budget: 4.9,
  cmp0: 5.3,
  cmp1: 5.7,
  panel: 6.0,
  best: 6.6,
  hold: 7.6,
  dates: 7.9,
  head: 8.4,
  cat: 8.65,
  catPick: 8.95,
  send: 9.3,
  ask: 9.4,
};

const venues = [
  { name: "Casa Alma", area: "Alfama, Lisbon", price: "$5,400", guests: 24, rating: "4.9", img: "1697421472608-84e71a8a24b1" },
  { name: "Quinta Azul", area: "Sintra · 35 min out", price: "$5,900", guests: 30, rating: "4.8", img: "1679394900352-05fd1ed3ed48" },
  { name: "Armazém 16", area: "Alcântara, Lisbon", price: "$4,900", guests: 20, rating: "4.6", img: "1776090188437-e368bbb75d93" },
];

function Top() {
  return (
    <div className="flex items-center gap-5 border-b border-black/[0.06] px-5 py-3 text-[13px]">
      <span className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em]">
        <Sun s={20} />
        Retreatly
      </span>
      <span className="text-[#5d6370]">Venues</span>
      <span className="text-[#5d6370]">Team trips</span>
      <span className="ml-auto grid size-7 place-items-center rounded-full bg-[#FDE8E1] text-[11px] font-semibold text-[#B8401F]">NL</span>
    </div>
  );
}

function Home({ t }: { t: number }) {
  const q = typed(QUERY, t, T.type, 34);
  const focus = t >= T.search && t < T.go;
  return (
    <div className="h-full bg-[#FFFBF8]">
      <Top />
      <div className="px-10 pt-12">
        <p className="max-w-[16ch] text-[34px] font-semibold leading-[1.05] tracking-[-0.03em]">Offsites your team will remember.</p>
        <p className="mt-3 text-[14px] text-[#5d6370]">2,400 venues for groups of 10 to 200, with catering and rooms.</p>
        <div className="mt-7 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_12px_30px_-14px_rgba(80,40,20,0.35)] ring-1 ring-black/[0.06]">
          <span data-c="search" className={`flex h-[44px] flex-1 items-center gap-2.5 rounded-xl px-3 text-[14px] ${focus ? "ring-2 ring-[#E4572E]/50" : ""}`}>
            <Search size={16} className="text-[#8a909c]" aria-hidden />
            {q ? <span>{q}</span> : <span className="text-[#9aa0ab]">Where, when, how many</span>}
            {focus && <span className="caret -ml-1.5 inline-block h-[16px] w-px bg-[#16181d]" />}
          </span>
          <span
            data-c="search-btn"
            className={`inline-flex h-[44px] items-center rounded-xl bg-[#E4572E] px-5 text-[14px] font-medium text-white ${t >= T.go && t < T.go + 0.18 ? "scale-[0.97]" : ""}`}
          >
            Search
          </span>
        </div>
        <div className="mt-6 flex gap-2 text-[12.5px] text-[#5d6370]">
          {["Lisbon", "Barcelona", "Mallorca", "Porto"].map((c) => (
            <span key={c} className="rounded-full bg-white px-3 py-1 ring-1 ring-black/[0.06]">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Results({ t }: { t: number }) {
  const capOpen = t >= T.cap && t < T.capPick + 0.15;
  const cap = t >= T.capPick;
  const budget = t >= T.budget;
  const cmp = [t >= T.cmp0, t >= T.cmp1, false];
  const panel = t >= T.panel && t < T.hold;
  const best = t >= T.best;
  const count = budget ? 3 : cap ? 7 : 18;
  return (
    <div className="relative h-full bg-[#FFFBF8]">
      <Top />
      <div className="px-5 pt-3">
        <div className="flex items-center gap-2 text-[12.5px]">
          <span data-c="f-cap" className={`relative inline-flex h-[30px] items-center gap-1.5 rounded-full px-3 ${cap ? "bg-[#16181d] text-white" : "bg-white ring-1 ring-black/10"}`}>
            <Users size={13} aria-hidden />
            {cap ? "20+ guests" : "Capacity"}
            <ChevronDown size={13} aria-hidden />
            {capOpen && (
              <span className="pop-in absolute left-0 top-[34px] z-10 w-[150px] rounded-xl bg-white p-1.5 text-[#16181d] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.08]">
                {["10+ guests", "20+ guests", "40+ guests"].map((o) => (
                  <span
                    key={o}
                    data-c={o === "20+ guests" ? "opt-20" : undefined}
                    className={`block rounded-md px-2.5 py-1.5 ${o === "20+ guests" && t >= T.capPick - 0.25 ? "bg-[#FDE8E1] text-[#B8401F]" : ""}`}
                  >
                    {o}
                  </span>
                ))}
              </span>
            )}
          </span>
          <span data-c="f-budget" className={`inline-flex h-[30px] items-center rounded-full px-3 ${budget ? "bg-[#16181d] text-white" : "bg-white ring-1 ring-black/10"}`}>
            {budget ? "Under $6,000" : "Budget"}
          </span>
          <span className="inline-flex h-[30px] items-center rounded-full bg-white px-3 ring-1 ring-black/10">Catering</span>
          <span className="ml-auto text-[#5d6370]">
            <span className="font-medium text-[#16181d] tabular-nums">{count}</span> venues in Lisbon
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {venues.map((v, i) => (
            <div key={v.name} className={`overflow-hidden rounded-xl bg-white ring-1 transition-shadow ${cmp[i] ? "ring-2 ring-[#E4572E]/60" : "ring-black/[0.07]"}`}>
              <div className="relative h-[112px] bg-[#EFE7E1]">
                <Image src={unsplash(v.img, 400)} alt="" fill sizes="240px" className="object-cover" />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11.5px] font-medium">
                  <Star size={11} className="fill-[#E4572E] text-[#E4572E]" aria-hidden />
                  {v.rating}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[14px] font-semibold tracking-[-0.01em]">{v.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#5d6370]">
                  <MapPin size={11} aria-hidden />
                  {v.area}
                </p>
                <p className="mt-2 flex items-center justify-between text-[12.5px]">
                  <span>
                    <span className="font-semibold">{v.price}</span> <span className="text-[#5d6370]">· 2 days</span>
                  </span>
                  <span className="text-[#5d6370]">{v.guests} guests</span>
                </p>
                <span data-c={`cmp-${i}`} className="mt-2.5 flex items-center gap-1.5 text-[12px] text-[#4b515c]">
                  <span className={`grid size-[14px] place-items-center rounded-[4px] ${cmp[i] ? "bg-[#E4572E] text-white" : "ring-1 ring-black/20"}`}>
                    {cmp[i] && <Check size={10} strokeWidth={3} aria-hidden />}
                  </span>
                  Compare
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* compare tray */}
      {panel && (
        <div className="tray-in absolute inset-x-4 bottom-4 rounded-2xl bg-white p-4 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.08]">
          <p className="mb-2.5 text-[13px] font-semibold">Comparing 2 venues</p>
          <div className="grid grid-cols-[1.2fr_1fr_1fr] text-[12.5px]">
            {[
              ["", "Casa Alma", "Quinta Azul"],
              ["2 days, 20 people", "$5,400", "$5,900"],
              ["Main room", "24 seated", "30 seated"],
              ["Lunch and dinner", "Included", "Extra $640"],
              ["From the airport", "20 min", "45 min"],
            ].map((r, i) =>
              r.map((c, j) => (
                <span
                  key={`${i}-${j}`}
                  className={`border-b border-black/[0.05] px-2 py-1.5 ${i === 0 ? "font-semibold" : j === 0 ? "text-[#5d6370]" : ""} ${
                    best && j === 1 && i > 0 ? "bg-[#EAF6EF] font-medium text-[#1f7a4d]" : ""
                  }`}
                >
                  {c}
                </span>
              )),
            )}
          </div>
          <div className="mt-3 flex justify-end">
            <span data-c="hold" className="inline-flex h-[32px] items-center rounded-lg bg-[#E4572E] px-4 text-[13px] font-medium text-white">
              Request hold at Casa Alma
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Hold({ t }: { t: number }) {
  const dates = typed("Oct 24 to 25", t, T.dates + 0.05, 30);
  const head = typed("20", t, T.head + 0.05, 20);
  const catOpen = t >= T.cat && t < T.catPick + 0.15;
  const cat = t >= T.catPick;
  const focus = t < T.head ? "dates" : t < T.cat ? "head" : "";
  const field = (on: boolean) => `flex h-[36px] items-center rounded-lg bg-white px-3 text-[13.5px] ${on ? "ring-2 ring-[#E4572E]/50" : "ring-1 ring-black/15"}`;
  return (
    <div className="flex h-full bg-[#FFFBF8]">
      <div className="relative w-[300px] shrink-0">
        <Image src={unsplash(venues[0].img, 600)} alt="" fill sizes="300px" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <p className="text-[18px] font-semibold tracking-[-0.02em]">Casa Alma</p>
          <p className="text-[12.5px] text-white/80">Alfama, Lisbon · up to 24 guests</p>
        </div>
      </div>
      <div className="flex-1 p-6">
        <p className="text-[18px] font-semibold tracking-[-0.02em]">Request a hold</p>
        <p className="mt-0.5 text-[13px] text-[#5d6370]">Free for 72 hours. No charge until you confirm.</p>
        <div className="mt-5 space-y-3.5">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-[#4b515c]">Dates</span>
            <span data-c="h-dates" className={field(focus === "dates")}>
              {dates}
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-[#4b515c]">Headcount</span>
            <span data-c="h-head" className={field(focus === "head")}>
              {head}
            </span>
          </label>
          <label className="relative block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-[#4b515c]">Catering</span>
            <span data-c="cat" className={`${field(catOpen)} justify-between`}>
              {cat ? "Lunch and dinner" : <span className="text-[#9aa0ab]">Choose a package</span>}
              <ChevronDown size={14} className="text-[#8a909c]" aria-hidden />
            </span>
            {catOpen && (
              <span className="pop-in absolute inset-x-0 top-[64px] z-10 rounded-xl bg-white p-1.5 text-[13px] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.08]">
                {["Breakfast only", "Lunch and dinner", "Full board"].map((o) => (
                  <span
                    key={o}
                    data-c={o === "Lunch and dinner" ? "opt-lunch" : undefined}
                    className={`block rounded-md px-2.5 py-1.5 ${o === "Lunch and dinner" && t >= T.catPick - 0.25 ? "bg-[#FDE8E1] text-[#B8401F]" : ""}`}
                  >
                    {o}
                  </span>
                ))}
              </span>
            )}
          </label>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4">
          <span className="text-[13px] text-[#5d6370]">
            Total <span className="text-[16px] font-semibold text-[#16181d]">$5,400</span>
          </span>
          <span data-c="send" className="inline-flex h-[34px] items-center rounded-lg bg-[#E4572E] px-4 text-[13px] font-medium text-white">
            Send hold request
          </span>
        </div>
      </div>
    </div>
  );
}

function Skel() {
  return (
    <div className="h-full space-y-4 bg-[#FFFBF8] p-6">
      <Sk className="h-6 w-40" />
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Sk className="h-[112px]" />
            <Sk className="h-4 w-24" />
            <Sk className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const offsite: Scenario = {
  id: "offsite",
  tab: "Book an offsite",
  duration: 12.5,
  askAt: T.ask,
  approval: "Place a hold at Casa Alma for Oct 24 to 25, $5,400?",
  log: [
    { at: T.go, done: T.results, text: "Searched venues in Lisbon" },
    { at: T.cap, done: T.budget + 0.2, text: "Filtered for 20 people under budget" },
    { at: T.cmp0, done: T.best + 0.4, text: "Compared 3 venues" },
    { at: T.best + 0.5, done: T.hold, text: "Chose Casa Alma (best fit for budget and space)" },
    { at: T.dates, done: T.send, text: "Prepared a hold request" },
  ],
  cursor: [
    { at: T.search, target: "search", click: true },
    { at: T.go, target: "search-btn", click: true },
    { at: T.cap, target: "f-cap", click: true },
    { at: T.capPick, target: "opt-20", click: true },
    { at: T.budget, target: "f-budget", click: true },
    { at: T.cmp0, target: "cmp-0", click: true },
    { at: T.cmp1, target: "cmp-1", click: true },
    { at: T.hold, target: "hold", click: true },
    { at: T.dates, target: "h-dates", click: true },
    { at: T.head, target: "h-head", click: true },
    { at: T.cat, target: "cat", click: true },
    { at: T.catPick, target: "opt-lunch", click: true },
    { at: T.send, target: "send" },
  ],
  chrome: (t) => ({
    tabs: [
      { title: "Retreatly · Team venues", icon: <Sun />, active: true },
      { title: "Offsite plan · Notes", icon: <span className="block size-3.5 rounded-[3px] bg-[#16181d]" />, active: false },
    ],
    url:
      t < T.load
        ? typed(URL, t, T.url)
        : t >= T.hold
          ? "retreatly.example/venues/casa-alma/hold"
          : t >= T.go
            ? "retreatly.example/search?city=lisbon&guests=20"
            : URL,
    typing: t < T.load,
    loading: (t >= T.load && t < T.ready) || (t >= T.go && t < T.results),
    session: t >= T.session,
  }),
  Page: ({ t }) => {
    if (t < T.go) return <Loadable ready={t >= T.ready} skeleton={t >= T.load ? <Skel /> : <div className="h-full bg-white" />}>{<Home t={t} />}</Loadable>;
    if (t < T.hold) return <Loadable ready={t >= T.results} skeleton={<Skel />}>{<Results t={t} />}</Loadable>;
    return <Hold t={t} />;
  },
};

