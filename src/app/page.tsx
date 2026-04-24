import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import { HeroSection } from "./_components/HeroSection";

const HERO_MARKER = "<!-- HERO_INJECTION_POINT -->";

export default function HomePage() {
  const bodyHtml = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.body.html"),
    "utf8"
  );
  const inlineJs = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.script.js"),
    "utf8"
  );

  const [beforeHero, afterHero] = bodyHtml.split(HERO_MARKER);
  if (afterHero === undefined) {
    throw new Error(
      `Missing ${HERO_MARKER} in home.body.html — hero injection won't work.`
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: beforeHero }} />
      <HeroSection />
      <div dangerouslySetInnerHTML={{ __html: afterHero }} />
      <Script id="damasqas-home" strategy="afterInteractive">
        {inlineJs}
      </Script>
    </>
  );
}
