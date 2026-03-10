import {
  HomeIcon,
  BookOpen,
  CodeIcon,
  FileCode2,
  MessageSquare,
  Database,
  Braces,
  Server,
} from "lucide-react";

export const ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://fixfx.wiki";

// Go backend API endpoint - always use production by default
// For local development with local backend, set API_URL environment variable to http://localhost:3001
export const API_URL =
  process.env.NODE_ENV === "development"
  ? "http://localhost:3001"
  : process.env.NEXT_PUBLIC_API_URL || "https://core.fixfx.wiki"
export const DISCORD_LINK = "https://discord.gg/cYauqJfnNK";
export const GITHUB_ORG = "https://github.com/FixFXOSS";
export const GITHUB_LINK = "https://github.com/FixFXOSS/FixFX";
export const DOCS_URL = "https://fixfx.wiki";

export const GIT_OWNER = "FixFXOSS";
export const GIT_REPO = "FixFX";
export const GIT_SHA = "master";

export const NAV_LINKS = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
    external: false,
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: BookOpen,
    external: false,
  },
  {
    name: "Natives",
    href: "/natives",
    icon: CodeIcon,
    external: false,
  },
  {
    name: "Game References",
    href: "/game-references",
    icon: Database,
    external: false,
  },
  {
    name: "Artifacts",
    href: "/artifacts",
    icon: FileCode2,
    external: false,
  },
  {
    name: "Validator",
    href: "/validator",
    icon: Braces,
    external: false,
  },
  {
    name: "Hosting",
    href: "/hosting",
    icon: Server,
    external: false,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
    external: false,
  },
];
