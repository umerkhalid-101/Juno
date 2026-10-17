import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "Juno runs the work. You run the company.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mascot = `data:image/svg+xml;base64,${await readFile(join(process.cwd(), "public/mascot/juno.svg"), "base64")}`;
const medium = await readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf"));

/** Share card: Juno in its glow, the promise underneath. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#07090d",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        {/* glow behind the mascot */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: -270,
            width: 800,
            height: 800,
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,156,255,0.5) 0%, rgba(50,76,255,0.3) 17%, rgba(143,124,255,0.1) 29%, rgba(7,9,13,0) 40%)",
          }}
        />
        {/* floor light */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 260,
            background: "linear-gradient(to top, rgba(70,90,255,0.14), rgba(7,9,13,0))",
          }}
        />
        <img src={mascot} width={220} height={220} style={{ marginTop: -20 }} alt="" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 44 }}>
          <div style={{ fontSize: 68, color: "#ffffff", letterSpacing: -2.6, lineHeight: 1.05 }}>Juno runs the work.</div>
          <div style={{ fontSize: 68, color: "#a6bbff", letterSpacing: -2.6, lineHeight: 1.05, marginTop: 4 }}>You run the company.</div>
        </div>
        <div style={{ position: "absolute", bottom: 40, fontSize: 22, color: "#7f8aa3", letterSpacing: -0.2 }}>
          Your AI chief of staff
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: medium, weight: 500, style: "normal" }] },
  );
}
