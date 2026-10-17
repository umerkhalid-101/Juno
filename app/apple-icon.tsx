import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mascot = `data:image/svg+xml;base64,${await readFile(join(process.cwd(), "public/mascot/juno.svg"), "base64")}`;

/** Home-screen icon: the mascot on Juno's dark glow. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(closest-side, #1a2350, #07090d)",
        }}
      >
        <img src={mascot} width={150} height={150} alt="" />
      </div>
    ),
    size,
  );
}
