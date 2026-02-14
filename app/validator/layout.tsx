import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Validator | FixFX",
  description:
    "Validate JSON syntax and txAdmin Discord bot embed configurations. Check your embed JSON and config JSON for errors before deploying.",
  keywords: [
    "JSON validator",
    "txAdmin",
    "Discord embed",
    "FiveM",
    "txAdmin Discord bot",
    "embed config",
    "JSON syntax checker",
  ],
  alternates: {
    canonical: "https://fixfx.wiki/validator",
  },
  openGraph: {
    title: "JSON Validator | FixFX",
    description:
      "Validate JSON syntax and txAdmin Discord bot embed configurations.",
    url: "https://fixfx.wiki/validator",
    type: "website",
  },
};

export default function ValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
