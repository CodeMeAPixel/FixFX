import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";

export const metadata: Metadata = {
  title: {
    template: "%s | Game References | FixFX",
    default: "Game References | FixFX",
  },
  description:
    "FiveM & RedM game reference data including blips, checkpoints, markers, ped models, weapon models, zones, HUD colors, and more.",
  keywords: [
    "FiveM game references",
    "FiveM blips",
    "FiveM markers",
    "FiveM ped models",
    "FiveM weapon models",
    "FiveM zones",
    "FiveM HUD colors",
    "CitizenFX reference",
    "GTA5 modding reference",
  ],
  alternates: {
    canonical: "https://fixfx.wiki/game-references",
  },
  openGraph: {
    title: "Game References | FixFX",
    description:
      "FiveM & RedM game reference data — blips, checkpoints, markers, ped models, weapon models, zones, HUD colors, and more.",
    url: "https://fixfx.wiki/game-references",
    type: "website",
  },
};

export default function GameReferencesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
