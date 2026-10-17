import { tools, type ToolId } from "@/lib/story";

/**
 * The tools' real, full-color marks. Multi-color logos are drawn from their official
 * artwork; single-color ones use the official brand color.
 */
const multi: Partial<Record<ToolId, { vb: string; paths: [string, string][] }>> = {
  slack: {
    vb: "0 0 127 127",
    paths: [
      ["#E01E5A", "M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z"],
      ["#36C5F0", "M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z"],
      ["#2EB67D", "M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z"],
      ["#ECB22E", "M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z"],
    ],
  },
  gmail: {
    vb: "52 42 88 66",
    paths: [
      ["#4285F4", "M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"],
      ["#34A853", "M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"],
      ["#FBBC04", "M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"],
      ["#EA4335", "M72 74V48l24 18 24-18v26L96 92"],
      ["#C5221F", "M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"],
    ],
  },
  drive: {
    vb: "0 0 87.3 78",
    paths: [
      ["#0066DA", "m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"],
      ["#00AC47", "m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"],
      ["#EA4335", "m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"],
      ["#00832D", "m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"],
      ["#2684FC", "m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"],
      ["#FFBA00", "m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"],
    ],
  },
  figma: {
    vb: "0 0 38 57",
    paths: [
      ["#1ABCFE", "M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"],
      ["#0ACF83", "M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"],
      ["#FF7262", "M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"],
      ["#F24E1E", "M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"],
      ["#A259FF", "M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"],
    ],
  },
};

/** Official single colors, for the marks drawn on a light tile. */
const solid: Partial<Record<ToolId, string>> = {
  notion: "#000000",
  hubspot: "#FF7A59",
  linear: "#5E6AD2",
  jira: "#0052CC",
  intercom: "#1F8DED",
  github: "#181717",
  calendar: "#4285F4",
};
/** On the dark site, these two read better in white. */
const onDark: Partial<Record<ToolId, string>> = { notion: "#FFFFFF", github: "#FFFFFF" };

export function BrandMark({ id, size = 20, dark = false, className = "" }: { id: ToolId; size?: number; dark?: boolean; className?: string }) {
  const m = multi[id];
  if (m) {
    return (
      <svg viewBox={m.vb} width={size} height={size} className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
        {m.paths.map(([fill, d]) => (
          <path key={d.slice(0, 12)} fill={fill} d={d} />
        ))}
      </svg>
    );
  }
  const fill = (dark && onDark[id]) || solid[id] || tools[id].hex;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path fill={fill} d={tools[id].path} />
    </svg>
  );
}

/** App-icon tile: the real logo on a white rounded square. */
export function BrandIcon({ id, size = 28, className = "" }: { id: ToolId; size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center bg-white shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_4px_12px_-4px_rgba(0,0,0,0.5)] ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      <BrandMark id={id} size={Math.round(size * 0.58)} />
    </span>
  );
}
