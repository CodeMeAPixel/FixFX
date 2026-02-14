import type { HomeLayoutProps } from "fumadocs-ui/layouts/home";
import { GITHUB_LINK, DISCORD_LINK } from "@/packages/utils/src";
import { FixFXIcon } from "@ui/icons";
import { FaDiscord } from "react-icons/fa";
import {
  Gamepad,
  Home,
  PlugZap,
  LogsIcon,
  Bot,
  X,
  Server,
  Palette,
  Braces,
} from "lucide-react";

export const baseOptions: HomeLayoutProps = {
  disableThemeSwitch: true,
  githubUrl: `${GITHUB_LINK}`,
  nav: {
    title: (
      <div className="flex flex-row items-center justify-center gap-x-2">
        <FixFXIcon className="size-6" />
        <p className="font-sans text-lg">FixFX</p>
      </div>
    ),
  },
  links: [
    {
      type: "icon",
      text: "Discord",
      icon: <FaDiscord className="size-6" />,
      url: "https://discord.gg/cYauqJfnNK",
    },
    {
      type: "icon",
      text: "Twitter/X",
      icon: <X className="size-6" />,
      url: "https://twitter.com/FixFXWiki",
    },
    {
      type: "main",
      text: "Home",
      icon: <Home className="size-6" />,
      url: "/",
    },
    {
      type: "menu",
      text: "Blog",
      url: "/blog",
      items: [
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Welcome to FixFX
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" />,
          text: "Introduction",
          description:
            "Welcome to FixFX, your comprehensive resource for CitizenFX.",
          url: "/blog/welcome",
        },
      ],
    },
    {
      type: "menu",
      text: "Documentation",
      url: "/docs/core",
      items: [
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Core Documentation
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" />,
          text: "Core Documentation",
          description: "Some information about FixFX.",
          url: "/docs/core",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" stroke="#2563eb" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  CitizenFX Documentation
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" stroke="#2563eb" />,
          text: "CitizenFX Ecosystem",
          description:
            "Explore some guides and information about the CitizenFX ecosystem.",
          url: "/docs/cfx",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" stroke="#10b981" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  txAdmin Documentation
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" stroke="#10b981" />,
          text: "txAdmin Documentation",
          description: "Managing your servers with and setting up txAdmin.",
          url: "/docs/txadmin",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" stroke="#a855f7" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  vMenu Documentation
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" stroke="#a855f7" />,
          text: "vMenu Documentation",
          description:
            "Server administration menu for player and server management.",
          url: "/docs/vmenu",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" stroke="#f97891" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Framework Documentation
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" stroke="#f97891" />,
          text: "Framework Documentation",
          description:
            "Explore some guides and information about the CFX Frameworks.",
          url: "/docs/frameworks",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" stroke="#79143b" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Common Guides
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" stroke="#79143b" />,
          text: "Common Guides",
          description: "Step-by-step guides for CitizenFX.",
          url: "/docs/guides",
        },
      ],
    },
    {
      type: "menu",
      text: "Resources",
      items: [
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#2365eb" />
                <h1 className="text-fd-foreground text-2xl font-bold">Fixie</h1>
              </div>
            ),
          },
          icon: <Bot className="size-6" stroke="#2365eb" />,
          text: "Chat with Fixie",
          description:
            "Fixie is a powerful AI assistant that can help you with all your CFX needs.",
          url: "/chat",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#94865b" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Natives
                </h1>
              </div>
            ),
          },
          icon: <Gamepad className="size-6" stroke="#94865b" />,
          text: "Game Natives",
          description:
            "Explore the natives for CFX, GTAV and RDR2 and their use cases.",
          url: "/natives",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#79143b" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Artifacts
                </h1>
              </div>
            ),
          },
          icon: <PlugZap className="size-6" stroke="#79143b" />,
          text: "Server Artifacts",
          description: "Explore the latest server artifacts for CFX.",
          url: "/artifacts",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#22c55e" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Hosting Partners
                </h1>
              </div>
            ),
          },
          icon: <Server className="size-6" stroke="#22c55e" />,
          text: "Hosting Partners",
          description:
            "Discover trusted hosting providers with exclusive discounts for FixFX users.",
          url: "/hosting",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#ec4899" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Brand Assets
                </h1>
              </div>
            ),
          },
          icon: <Palette className="size-6" stroke="#ec4899" />,
          text: "Brand Assets",
          description:
            "Download official FixFX logos, icons, and brand guidelines.",
          url: "/brand",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#f59e0b" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  JSON Validator
                </h1>
              </div>
            ),
          },
          icon: <Braces className="size-6" stroke="#f59e0b" />,
          text: "JSON Validator",
          description:
            "Validate JSON syntax and txAdmin Discord bot embed configurations.",
          url: "/validator",
        },
      ],
    },
  ],
};
