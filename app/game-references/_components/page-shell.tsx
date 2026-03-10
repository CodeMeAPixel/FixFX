"use client";

import Link from "next/link";
import { ChevronLeft, Search, X, type LucideIcon } from "lucide-react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { cn } from "@utils/functions/cn";

// ---------------------------------------------------------------------------
// PageShell
// ---------------------------------------------------------------------------

interface GameReferencePageShellProps {
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    title: string;
    description: React.ReactNode;
    badge?: string;
    controls?: React.ReactNode;
    children: React.ReactNode;
}

export function GameReferencePageShell({
    icon: Icon,
    iconColor,
    iconBg,
    title,
    description,
    badge,
    controls,
    children,
}: GameReferencePageShellProps) {
    return (
        <div className="relative min-h-screen bg-fd-background">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-primary/8 blur-[110px] opacity-40" />
                <div className="absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-[90px] opacity-30" />
            </div>

            {/* Header */}
            <div className="border-b border-fd-border bg-fd-card/70 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 pt-4 pb-5 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <Link
                        href="/game-references"
                        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Game References
                    </Link>

                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                            className={cn(
                                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br",
                                iconBg,
                            )}
                        >
                            <Icon className={cn("h-6 w-6", iconColor)} />
                        </div>

                        {/* Title + description */}
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl font-bold tracking-tight text-fd-foreground">
                                    {title}
                                </h1>
                                {badge && (
                                    <span className="inline-flex items-center rounded-full border border-fd-border bg-fd-muted px-2.5 py-0.5 text-xs font-medium text-fd-muted-foreground tabular-nums">
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Tabs / filters / search */}
                    {controls && <div className="mt-4 space-y-3">{controls}</div>}
                </div>
            </div>

            {/* Main content */}
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// ReferenceSearch — consistent search bar used across all pages
// ---------------------------------------------------------------------------

interface ReferenceSearchProps {
    value: string;
    placeholder: string;
    onChange: (v: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

export function ReferenceSearch({
    value,
    placeholder,
    onChange,
    onSearch,
    onClear,
}: ReferenceSearchProps) {
    return (
        <div className="flex gap-2">
            <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fd-muted-foreground" />
                <Input
                    className="pl-9 pr-9"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
                {value && (
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                        onClick={onClear}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <Button onClick={onSearch}>Search</Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// ReferencePagination — consistent pagination used across all pages
// ---------------------------------------------------------------------------

interface ReferencePaginationProps {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export function ReferencePagination({
    offset,
    limit,
    total,
    hasMore,
    onPrev,
    onNext,
}: ReferencePaginationProps) {
    if (!hasMore && offset === 0) return null;
    return (
        <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" disabled={offset === 0} onClick={onPrev}>
                Previous
            </Button>
            <span className="text-sm tabular-nums text-fd-muted-foreground">
                {offset + 1}–{Math.min(offset + limit, total)} of {total}
            </span>
            <Button variant="outline" size="sm" disabled={!hasMore} onClick={onNext}>
                Next
            </Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// ReferenceFilterChips — pill-style filter buttons
// ---------------------------------------------------------------------------

interface ReferenceFilterChipsProps {
    allLabel?: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
    formatLabel?: (opt: string) => string;
}

export function ReferenceFilterChips({
    allLabel = "All",
    options,
    value,
    onChange,
    formatLabel,
}: ReferenceFilterChipsProps) {
    if (options.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1.5">
            <Button
                variant={value === "" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange("")}
            >
                {allLabel}
            </Button>
            {[...options].sort().map((opt) => (
                <Button
                    key={opt}
                    variant={value === opt ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(opt)}
                >
                    {formatLabel ? formatLabel(opt) : opt}
                </Button>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// ReferenceTabs — horizontal tab switcher
// ---------------------------------------------------------------------------

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface ReferenceTabsProps {
    tabs: Tab[];
    active: string;
    onChange: (id: string) => void;
}

export function ReferenceTabs({ tabs, active, onChange }: ReferenceTabsProps) {
    return (
        <div className="flex gap-1 rounded-lg border border-fd-border bg-fd-muted/50 p-1 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                        active === tab.id
                            ? "bg-fd-card text-fd-foreground shadow-sm"
                            : "text-fd-muted-foreground hover:text-fd-foreground",
                    )}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="ml-1.5 rounded-full bg-fd-muted px-1.5 py-0.5 text-xs tabular-nums">
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
