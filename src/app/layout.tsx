import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Damasqas | Your AI SRE | Incident Triage, Root Cause Analysis & Auto-Remediation",
  description:
    "Damasqas is an AI SRE that connects to your monitoring, logs, and deployments. It triages alerts, investigates incidents, rolls back bad deploys, and remediates autonomously. All from Slack. Free to start.",
  keywords: [
    "AI SRE",
    "incident management",
    "root cause analysis",
    "auto-remediation",
    "alert denoising",
    "on-call automation",
    "PagerDuty",
    "Datadog",
    "site reliability engineering",
    "incident response",
    "Slack bot",
    "production monitoring",
  ],
  alternates: { canonical: "https://damasqas.com/" },
  openGraph: {
    type: "website",
    title: "Damasqas | Your AI SRE",
    description:
      "AI agent built exclusively for site reliability. Connects to your stack, triages alerts, investigates incidents, and remediates autonomously. Not a workflow tool, a specialist.",
    url: "https://damasqas.com/",
    siteName: "Damasqas",
    images: ["https://damasqas.com/cloud-logo-v2.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Damasqas | Your AI SRE",
    description:
      "AI agent built exclusively for site reliability. Triages alerts, investigates incidents, remediates autonomously. From Slack.",
    images: ["https://damasqas.com/cloud-logo-v2.jpg"],
  },
  icons: { icon: "/cloud-logo-v2.jpg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Damasqas",
  url: "https://damasqas.com",
  description:
    "AI-powered SRE that connects to your monitoring, logs, and deployments. Triages alerts, investigates incidents, and remediates autonomously.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://damasqas.com/docs#{search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
