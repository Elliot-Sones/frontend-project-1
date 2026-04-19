import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

export default function HomePage() {
  const bodyHtml = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.body.html"),
    "utf8"
  );
  const inlineJs = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.script.js"),
    "utf8"
  );

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <Script id="damasqas-home" strategy="afterInteractive">
        {inlineJs}
      </Script>
    </>
  );
}
