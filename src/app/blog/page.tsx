import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Announcing Damasqas: The AI SRE That Triages, Investigates, and Fixes Your Incidents",
  description:
    "After running on-call at AWS, Moment (hedge fund), Pocus (acquired by Apollo), and more, I built the AI SRE I wished I had. Damasqas connects to your monitoring, correlates signals across your stack, and remediates autonomously. All from Slack.",
  keywords: [
    "AI SRE",
    "incident response",
    "root cause analysis",
    "auto-remediation",
    "alert denoising",
    "on-call automation",
    "site reliability engineering",
    "Slack bot",
    "production monitoring",
    "PagerDuty alternative",
  ],
  authors: [{ name: "Shalin Patel" }],
  alternates: { canonical: "https://damasqas.com/blog" },
  openGraph: {
    type: "article",
    title:
      "Announcing Damasqas: The AI SRE That Triages, Investigates, and Fixes Your Incidents",
    description:
      "After running on-call at AWS, Moment, and Pocus, I built the AI SRE I wished I had. It connects to your stack, correlates signals, and remediates autonomously.",
    url: "https://damasqas.com/blog",
    siteName: "Damasqas",
    images: ["https://damasqas.com/cloud-logo-v2.jpg"],
    publishedTime: "2026-03-26T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Announcing Damasqas: The AI SRE That Triages, Investigates, and Fixes Your Incidents",
    description:
      "After running on-call at AWS, Moment, and Pocus, I built the AI SRE I wished I had. All from Slack.",
    images: ["https://damasqas.com/cloud-logo-v2.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "Announcing Damasqas: The AI SRE That Triages, Investigates, and Fixes Your Incidents",
  description:
    "After running on-call at AWS, Moment (hedge fund), Pocus (acquired by Apollo), and more, I built the AI SRE I wished I had.",
  author: {
    "@type": "Person",
    name: "Shalin Patel",
    url: "https://www.linkedin.com/in/shalin1patel/",
    jobTitle: "Founder",
    worksFor: { "@type": "Organization", name: "Damasqas" },
  },
  publisher: {
    "@type": "Organization",
    name: "Damasqas",
    url: "https://damasqas.com",
  },
  datePublished: "2026-03-26",
  dateModified: "2026-03-26",
  mainEntityOfPage: "https://damasqas.com/blog",
  image: "https://damasqas.com/cloud-logo-v2.jpg",
  keywords: [
    "AI SRE",
    "incident response",
    "root cause analysis",
    "auto-remediation",
    "on-call automation",
    "Slack bot",
  ],
  articleSection: "Product Launch",
};

export default function BlogPage() {
  const bodyHtml = fs.readFileSync(
    path.join(process.cwd(), "src/app/blog/blog.body.html"),
    "utf8"
  );
  const css = fs.readFileSync(
    path.join(process.cwd(), "src/app/blog/blog.css"),
    "utf8"
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
