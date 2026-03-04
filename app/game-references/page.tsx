"use client";

import Link from "next/link";
import {
    Crosshair,
    MapPin,
    Layers,
    Users,
    Sword,
    FileCode,
    Zap,
    Tag,
    Palette,
    Network,
    Hash,
    Map,
    ArrowRight,
    BookOpen,
    Database,
} from "lucide-react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";

const REFERENCES = [
    {
        slug: "blips",
        label: "Map Blips",
        description: "All minimap blip icons with IDs and the full blip colour palette.",
        icon: Crosshair,
        color: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
        iconColor: "text-blue-500",
        tag: "blips",
    },
    {
        slug: "checkpoints",
        label: "Checkpoints",
        description: "Checkpoint types for CREATE_CHECKPOINT — standard and type 44–46 variants.",
        icon: MapPin,
        color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
        iconColor: "text-emerald-500",
        tag: "checkpoints",
    },
    {
        slug: "markers",
        label: "Markers",
        description: "All 44 DRAW_MARKER types with IDs and name labels.",
        icon: Layers,
        color: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
        iconColor: "text-orange-500",
        tag: "markers",
    },
    {
        slug: "ped-models",
        label: "Ped Models",
        description: "Pedestrian model names with category filters, prop and component counts.",
        icon: Users,
        color: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
        iconColor: "text-violet-500",
        tag: "ped-models",
    },
    {
        slug: "weapon-models",
        label: "Weapon Models",
        description: "Weapon model names grouped by type with hash keys, DLC info, components, and tints.",
        icon: Sword,
        color: "from-red-500/20 to-red-600/5 border-red-500/20",
        iconColor: "text-red-500",
        tag: "weapon-models",
    },
    {
        slug: "data-files",
        label: "Data Files",
        description: "All resource manifest data_file keys with file type, root element, and mounter details.",
        icon: FileCode,
        color: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20",
        iconColor: "text-cyan-500",
        tag: "data-files",
    },
    {
        slug: "game-events",
        label: "Game Events",
        description: "Client-side game events with descriptions for use in resource scripting.",
        icon: Zap,
        color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/20",
        iconColor: "text-yellow-500",
        tag: "game-events",
    },
    {
        slug: "gamer-tags",
        label: "Gamer Tags",
        description: "Head display component IDs for SET_MULTIPLAYER_HANGER_COLOUR and related natives.",
        icon: Tag,
        color: "from-pink-500/20 to-pink-600/5 border-pink-500/20",
        iconColor: "text-pink-500",
        tag: "gamer-tags",
    },
    {
        slug: "hud-colors",
        label: "HUD Colors",
        description: "All ~234 HUD colour indices with RGBA values and hex codes — swatch grid and table view.",
        icon: Palette,
        color: "from-fuchsia-500/20 to-fuchsia-600/5 border-fuchsia-500/20",
        iconColor: "text-fuchsia-500",
        tag: "hud-colors",
    },
    {
        slug: "net-game-events",
        label: "Net Game Events",
        description: "GTA_EVENT_IDS enum entries with sequential IDs for network event handling.",
        icon: Network,
        color: "from-sky-500/20 to-sky-600/5 border-sky-500/20",
        iconColor: "text-sky-500",
        tag: "net-game-events",
    },
    {
        slug: "pickup-hashes",
        label: "Pickup Hashes",
        description: "ePickupHashes enum entries with numeric hash values for pickup scripting.",
        icon: Hash,
        color: "from-lime-500/20 to-lime-600/5 border-lime-500/20",
        iconColor: "text-lime-500",
        tag: "pickup-hashes",
    },
    {
        slug: "zones",
        label: "Zones",
        description: "All 1300+ map zones with zone name IDs and descriptions for area detection.",
        icon: Map,
        color: "from-teal-500/20 to-teal-600/5 border-teal-500/20",
        iconColor: "text-teal-500",
        tag: "zones",
    },
];

interface SummaryData {
    success: boolean;
    counts: Record<string, number>;
    total: number;
}

export default function GameReferencesPage() {
    const { data: summary } = useFetch<SummaryData>(
        `${API_URL}/api/game-references/summary`,
        {},
        [],
    );

    const counts = summary?.counts ?? {};
    const totalEntries = summary?.total;

    return (
        <div className="relative min-h-screen bg-fd-background">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] opacity-60" />
                <div className="absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-violet-500/8 blur-[100px] opacity-40" />
                <div className="absolute -bottom-40 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl opacity-50" />
            </div>

            {/* Hero */}
            <div className="border-b border-fd-border bg-fd-card/60 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                                <BookOpen className="h-3.5 w-3.5" />
                                Game References
                            </span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-fd-foreground sm:text-5xl">
                            FiveM{" "}
                            <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Reference Data
                            </span>
                        </h1>

                        <p className="max-w-2xl text-base text-fd-muted-foreground leading-relaxed">
                            Searchable reference tables for GTA V and FiveM internals — blips,
                            markers, ped models, weapon models, HUD colours, zones, and more.
                            Everything you need for scripting, mapped and indexed.
                        </p>

                        {/* Stats row */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                            <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
                                <Database className="h-4 w-4 text-primary" />
                                <span>
                                    <span className="font-semibold text-fd-foreground">
                                        {REFERENCES.length}
                                    </span>{" "}
                                    reference categories
                                </span>
                            </div>
                            {totalEntries !== undefined && (
                                <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
                                    <span className="h-1 w-1 rounded-full bg-fd-muted-foreground/50" />
                                    <span>
                                        <span className="font-semibold text-fd-foreground">
                                            {totalEntries.toLocaleString()}+
                                        </span>{" "}
                                        total entries
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {REFERENCES.map(({ slug, label, description, icon: Icon, color, iconColor, tag }) => {
                        const count = counts[tag];
                        return (
                            <Link
                                key={slug}
                                href={`/game-references/${slug}`}
                                className="group relative flex flex-col gap-4 rounded-xl border border-fd-border bg-fd-card/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-fd-border/80 hover:bg-fd-card hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5"
                            >
                                {/* Icon */}
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-gradient-to-br ${color}`}
                                >
                                    <Icon className={`h-5 w-5 ${iconColor}`} />
                                </div>

                                {/* Text */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="text-sm font-semibold text-fd-foreground leading-tight">
                                            {label}
                                        </h2>
                                        {count !== undefined && (
                                            <span className="flex-shrink-0 rounded-full bg-fd-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-fd-muted-foreground">
                                                {count.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1.5 text-xs text-fd-muted-foreground leading-relaxed">
                                        {description}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center gap-1 text-xs font-medium text-fd-muted-foreground transition-colors group-hover:text-fd-foreground">
                                    Explore
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}