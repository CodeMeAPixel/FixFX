"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { MapPin } from "lucide-react";
import {
  GameReferencePageShell, ReferenceSearch, ReferencePagination, ReferenceFilterChips,
} from "../_components/page-shell";

interface Checkpoint { id: string; label: string; section: "standard" | "type-44-46"; imageUrl: string }
interface ApiResponse {
  success: boolean; count: number; data: Checkpoint[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function CheckpointsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [section, setSection] = useState<"" | "standard" | "type-44-46">("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/checkpoints?search=${encodeURIComponent(search)}&section=${section}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, section, offset]);

  const checkpoints = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };
  const handleSection = (s: string) => { setSection(s as "" | "standard" | "type-44-46"); setOffset(0); };

  const sectionLabels: Record<string, string> = {
    "": "All",
    standard: "Standard (0–49)",
    "type-44-46": "Type 44–46",
  };

  return (
    <GameReferencePageShell
      icon={MapPin}
      iconColor="text-emerald-500"
      iconBg="from-emerald-500/20 to-emerald-600/5 border-emerald-500/20"
      title="Checkpoint Types"
      description={<>All checkpoint types for use with <code>CREATE_CHECKPOINT</code>.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} types` : undefined}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {(["", "standard", "type-44-46"] as const).map((s) => (
              <button
                key={s || "all"}
                onClick={() => handleSection(s)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all border ${section === s ? "bg-fd-card text-fd-foreground border-fd-border shadow-sm" : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"}`}
              >
                {sectionLabels[s]}
              </button>
            ))}
          </div>
          <ReferenceSearch
            value={inputValue} placeholder="Search by ID or label…"
            onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
          />
        </div>
      }
    >
      {isPending ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-fd-muted" />
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{checkpoints.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? checkpoints.length}</span> checkpoints
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
            {checkpoints.map((cp, i) => (
              <div
                key={`${cp.section}-${cp.id}-${i}`}
                className="group flex flex-col items-center gap-1.5 rounded-lg border border-fd-border bg-fd-card p-2 text-center transition-colors hover:bg-fd-accent"
                title={cp.label ? `ID ${cp.id} — ${cp.label}` : `ID ${cp.id}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cp.imageUrl} alt={cp.id} className="h-10 w-10 object-contain" loading="lazy" />
                <span className="text-[10px] font-mono text-fd-muted-foreground">{cp.id}</span>
                {cp.label && <span className="text-[9px] text-fd-muted-foreground/70 leading-tight line-clamp-2">{cp.label}</span>}
              </div>
            ))}
          </div>
          <ReferencePagination
            offset={offset} limit={LIMIT} total={metadata?.total ?? 0}
            hasMore={metadata?.hasMore ?? false}
            onPrev={() => setOffset(Math.max(0, offset - LIMIT))}
            onNext={() => setOffset(offset + LIMIT)}
          />
        </>
      )}
    </GameReferencePageShell>
  );
}