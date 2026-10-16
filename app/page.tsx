import { Ch0Promise } from "@/components/chapters/Ch0Promise";
import { Ch1Chaos } from "@/components/chapters/Ch1Chaos";
import { Statement } from "@/components/chapters/Statement";
import { Ch2Brain } from "@/components/chapters/Ch2Brain";
import { ChAsk } from "@/components/chapters/ChAsk";
import { ChBuild } from "@/components/chapters/ChBuild";
import { ChComputer } from "@/components/chapters/ChComputer";
import { ChRepeat } from "@/components/chapters/ChRepeat";
import { ChStack } from "@/components/chapters/ChStack";
import { Ch7Close } from "@/components/chapters/Ch7Close";

export default function Home() {
  return (
    <main id="main">
      <Ch0Promise />
      <Ch1Chaos />
      <Statement />
      <Ch2Brain />
      <ChAsk />
      <ChBuild />
      <ChComputer />
      <ChRepeat />
      <ChStack />
      <Ch7Close />
    </main>
  );
}
