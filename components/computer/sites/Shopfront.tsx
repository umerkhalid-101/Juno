import Image from "next/image";
import { Check, ChevronDown, Search } from "lucide-react";
import { Loadable, Sk } from "../Browser";
import { prog, typed, typingEnd, unsplash, type Scenario } from "../kit";

const Bag = ({ s = 14 }: { s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden>
    <rect width="16" height="16" rx="4" fill="#0F766E" />
    <path d="M4.5 6.5h7l-.6 5.5H5.1z" fill="#fff" />
    <path d="M6.3 6.5V5.6a1.7 1.7 0 0 1 3.4 0v.9" fill="none" stroke="#fff" strokeWidth="1.2" />
  </svg>
);

const URL = "admin.shopfront.com/products";
const T = {
  url: 0.3,
  load: typingEnd(URL, 0.3) + 0.05,
  ready: 1.9,
  session: 1.6,
  coll: 2.2,
  pick: 2.6,
  selAll: 3.1,
  bulk: 3.6,
  apply: 4.0,
  start: 4.2,
  end: 8.2,
  publish: 8.4,
  ask: 8.9,
};

const bases = [
  { n: "Merino crew", code: "MC", img: "1611312449545-94176309c857", old: 98, now: 108 },
  { n: "Cable knit sweater", code: "CK", img: "1641642231157-0849081598a2", old: 128, now: 138 },
  { n: "Rib beanie", code: "RB", img: "1588676000557-dc67e2d3bd19", old: 32, now: 36 },
  { n: "Wool throw", code: "WT", img: "1731404247714-f19f610b32d4", old: 145, now: 159 },
  { n: "Chunky scarf", code: "CS", img: "1594350532402-72001d9fe5a0", old: 54, now: 59 },
  { n: "Fisherman knit", code: "FK", img: "1595026525047-dfa997df8a4a", old: 118, now: 128 },
  { n: "Cotton crew", code: "CC", img: "1586363104862-3a5e2ab60d99", old: 68, now: 74 },
  { n: "Knit cardigan", code: "KC", img: "1602706294170-1fed8eecd9f9", old: 112, now: 122 },
];
const colors = ["Oat", "Charcoal", "Rust", "Moss", "Navy"];
const products = Array.from({ length: 40 }, (_, i) => {
  const b = bases[i % 8];
  const c = colors[Math.floor(i / 8)];
  return { ...b, name: `${b.n} · ${c}`, sku: `AU-${b.code}-${c.slice(0, 3).toUpperCase()}`, stock: 12 + ((i * 37) % 80) };
});
const ROW = 44;
const money = (n: number) => `$${n}.00`;

function Side() {
  return (
    <aside className="flex w-[150px] shrink-0 flex-col gap-0.5 bg-[#F3F5F4] p-3 text-[13px]">
      <span className="mb-4 flex items-center gap-2 px-2 pt-1 text-[14px] font-semibold tracking-[-0.01em]">
        <Bag s={18} />
        Shopfront
      </span>
      {["Home", "Orders", "Products", "Customers", "Discounts", "Analytics"].map((n) => (
        <span key={n} className={`rounded-md px-2 py-1.5 ${n === "Products" ? "bg-white font-medium text-[#0B5C55] shadow-sm" : "text-[#4b515c]"}`}>
          {n}
        </span>
      ))}
    </aside>
  );
}

function Products({ t }: { t: number }) {
  const open = t >= T.coll && t < T.pick + 0.15;
  const autumn = t >= T.pick;
  const sel = t >= T.selAll;
  const modal = t >= T.bulk && t < T.apply + 0.12;
  const p = prog(t, T.start, T.end);
  const done = t >= T.start ? Math.floor(p * 40) : 0;
  const scroll = Math.max(0, p * 40 - 5) * ROW;
  const maxScroll = (40 - 7) * ROW;
  return (
    <div className="flex h-full">
      <Side />
      <main className="relative flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <p className="text-[19px] font-semibold tracking-[-0.02em]">Products</p>
          <span data-c="publish" className={`inline-flex h-[32px] items-center rounded-lg px-3.5 text-[13px] font-medium ${done >= 40 ? "bg-[#0F766E] text-white" : "bg-[#E7ECEB] text-[#8a909c]"}`}>
            Publish changes
          </span>
        </div>
        <div className="mt-3.5 flex items-center gap-2 text-[13px]">
          <span data-c="coll" className={`relative inline-flex h-[32px] items-center gap-2 rounded-lg px-3 ${autumn ? "bg-[#E6F2F0] text-[#0B5C55]" : "bg-white ring-1 ring-black/10"}`}>
            {autumn ? "Autumn collection" : "All collections"}
            <ChevronDown size={14} aria-hidden />
            {open && (
              <span className="pop-in absolute left-0 top-[36px] z-20 w-[190px] rounded-xl bg-white p-1.5 text-[#16181d] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.08]">
                {["All collections", "Autumn collection", "Essentials", "Gift guide"].map((o) => (
                  <span key={o} data-c={o === "Autumn collection" ? "opt-autumn" : undefined} className={`block rounded-md px-2.5 py-1.5 ${o === "Autumn collection" && t >= T.pick - 0.25 ? "bg-[#E6F2F0] text-[#0B5C55]" : ""}`}>
                    {o}
                  </span>
                ))}
              </span>
            )}
          </span>
          <span className="inline-flex h-[32px] flex-1 items-center gap-2 rounded-lg bg-white px-3 text-[#9aa0ab] ring-1 ring-black/10">
            <Search size={14} aria-hidden />
            Search products
          </span>
          <span className="text-[#5d6370]">
            <span className="font-medium text-[#16181d] tabular-nums">{autumn ? 40 : 212}</span> products
          </span>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.07]">
          <div className="grid h-[38px] shrink-0 grid-cols-[34px_1fr_120px_70px_150px] items-center border-b border-black/[0.06] bg-[#F8F9F9] px-3 text-[12px] font-medium text-[#6b717d]">
            <span data-c="sel-all" className={`grid size-[15px] place-items-center rounded-[4px] ${sel ? "bg-[#0F766E] text-white" : "ring-1 ring-black/20"}`}>
              {sel && <Check size={11} strokeWidth={3} aria-hidden />}
            </span>
            {sel ? (
              <span className="col-span-4 flex items-center gap-3 text-[#16181d]">
                40 selected
                <span data-c="bulk" className={`rounded-md bg-white px-2.5 py-1 text-[12px] font-medium ring-1 ring-black/10 ${t >= T.bulk && t < T.bulk + 0.18 ? "scale-[0.97]" : ""}`}>
                  Bulk edit
                </span>
                {t >= T.start && (
                  <span className="ml-auto font-normal text-[#5d6370] tabular-nums">
                    Updating prices · {done}/40
                  </span>
                )}
              </span>
            ) : (
              <>
                <span>Product</span>
                <span>SKU</span>
                <span>Stock</span>
                <span className="text-right">Price</span>
              </>
            )}
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div style={{ transform: `translateY(${-Math.min(scroll, maxScroll)}px)` }}>
              {(autumn ? products : products.slice(0, 9)).map((r, i) => {
                const upd = i < done;
                const now = t >= T.start && i === done && done < 40;
                return (
                  <div
                    key={r.sku}
                    className={`grid grid-cols-[34px_1fr_120px_70px_150px] items-center border-b border-black/[0.04] px-3 text-[13px] ${now ? "bg-[#EEF7F5]" : sel ? "bg-[#FAFCFC]" : ""}`}
                    style={{ height: ROW }}
                  >
                    <span className={`grid size-[15px] place-items-center rounded-[4px] ${sel ? "bg-[#0F766E] text-white" : "ring-1 ring-black/20"}`}>
                      {sel && <Check size={11} strokeWidth={3} aria-hidden />}
                    </span>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="relative size-[30px] shrink-0 overflow-hidden rounded-md bg-[#EEE9E3]">
                        <Image src={unsplash(r.img, 80)} alt="" fill sizes="30px" className="object-cover" />
                      </span>
                      <span className="truncate">{autumn ? r.name : r.n}</span>
                    </span>
                    <span className="font-mono text-[12px] text-[#5d6370]">{r.sku}</span>
                    <span className="text-[#5d6370] tabular-nums">{r.stock}</span>
                    <span className="text-right tabular-nums">
                      {upd ? (
                        <>
                          <s className="mr-2 text-[#9aa0ab]">{money(r.old)}</s>
                          <span className="font-semibold text-[#0B5C55]">{money(r.now)}</span>
                        </>
                      ) : (
                        money(r.old)
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* bulk edit dialog */}
        {modal && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/20">
            <div className="pop-in w-[340px] rounded-2xl bg-white p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)]">
              <p className="text-[15px] font-semibold">Bulk edit 40 products</p>
              <p className="mt-1 text-[13px] text-[#5d6370]">Update prices from a sheet.</p>
              <span className="mt-4 flex h-[36px] items-center justify-between rounded-lg px-3 text-[13px] ring-1 ring-black/15">
                Autumn prices, Q4
                <ChevronDown size={14} className="text-[#8a909c]" aria-hidden />
              </span>
              <div className="mt-4 flex justify-end gap-2">
                <span className="inline-flex h-[32px] items-center rounded-lg px-3 text-[13px] text-[#4b515c]">Cancel</span>
                <span data-c="apply" className={`inline-flex h-[32px] items-center rounded-lg bg-[#0F766E] px-3.5 text-[13px] font-medium text-white ${t >= T.apply && t < T.apply + 0.15 ? "scale-[0.97]" : ""}`}>
                  Apply price list
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Skel() {
  return (
    <div className="flex h-full">
      <div className="w-[150px] space-y-3 bg-[#F3F5F4] p-4">
        <Sk className="h-5 w-24" />
        {[0, 1, 2, 3, 4].map((i) => (
          <Sk key={i} className="h-4 w-20" />
        ))}
      </div>
      <div className="flex-1 space-y-3 p-5">
        <Sk className="h-6 w-32" />
        <Sk className="h-8 w-full" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Sk key={i} className="h-9 w-full" />
        ))}
      </div>
    </div>
  );
}

export const prices: Scenario = {
  id: "prices",
  tab: "Update 40 prices",
  duration: 12,
  askAt: T.ask,
  approval: "Publish 40 price changes to your store?",
  log: [
    { at: T.pick, done: T.pick + 0.3, text: "Opened the Autumn collection" },
    { at: T.selAll, done: T.selAll + 0.3, text: "Selected 40 products" },
    {
      at: T.start,
      done: T.end,
      text: "Applied the new price list",
      live: (t) => `Applying the new price list · ${Math.floor(prog(t, T.start, T.end) * 40)}/40`,
    },
    { at: T.end + 0.1, done: T.ask - 0.1, text: "Checked every price against the sheet" },
  ],
  cursor: [
    { at: T.coll, target: "coll", click: true },
    { at: T.pick, target: "opt-autumn", click: true },
    { at: T.selAll, target: "sel-all", click: true },
    { at: T.bulk, target: "bulk", click: true },
    { at: T.apply, target: "apply", click: true },
    { at: T.publish, target: "publish" },
  ],
  chrome: (t) => ({
    tabs: [
      { title: "Products · Shopfront", icon: <Bag />, active: true },
      { title: "Autumn prices, Q4", icon: <span className="block size-3.5 rounded-[3px] bg-[#D97706]" />, active: false },
    ],
    url: t < T.load ? typed(URL, t, T.url) : t >= T.pick ? "admin.shopfront.com/products?collection=autumn" : URL,
    typing: t < T.load,
    loading: t >= T.load && t < T.ready,
    session: t >= T.session,
  }),
  Page: ({ t }) => (
    <Loadable ready={t >= T.ready} skeleton={t >= T.load ? <Skel /> : <div className="h-full bg-white" />}>
      <Products t={t} />
    </Loadable>
  ),
};
