"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Crosshair } from "lucide-react";
import {
  GameReferencePageShell,
  ReferenceSearch,
  ReferencePagination,
  ReferenceTabs,
} from "../_components/page-shell";

interface Blip { id: number; name: string; imageUrl: string }
interface BlipColor { id: number; name: string; hex: string }
interface BlipsApiResponse {
  success: boolean; count: number;
  data: { blips: Blip[]; colors: BlipColor[] };
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function BlipsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<"blips" | "colors">("blips");

  const url = `${API_URL}/api/game-references/blips?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<BlipsApiResponse>(url, {}, [search, offset]);

  const blips = data?.data?.blips ?? [];
  const colors = data?.data?.colors ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Crosshair}
      iconColor="text-blue-500"
      iconBg="from-blue-500/20 to-blue-600/5 border-blue-500/20"
      title="Map Blips"
      description="All blip icons available for use on the minimap and main map via ADD_BLIP_FOR_COORD."
      badge={metadata ? `${metadata.total.toLocaleString()} blips` : undefined}
      controls={
        <div className="space-y-3">
          <ReferenceTabs
            tabs={[
              { id: "blips", label: "Blips", count: metadata?.total },
              { id: "colors", label: "Colors", count: colors.length || undefined },
            ]}
            active={activeTab}
            onChange={(t) => setActiveTab(t as "blips" | "colors")}
          />
          {activeTab === "blips" && (
            <ReferenceSearch
              value={inputValue} placeholder="Search blips…"
              onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
            />
          )}
        </div>
      }
    >
      {isPending ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-fd-muted" />
          ))}
        </div>
      ) : activeTab === "blips" ? (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{blips.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? blips.length}</span> blips
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
            {blips.map((blip) => (
              <div
                key={`${blip.id}-${blip.name}`}
                className="group flex flex-col items-center gap-1.5 rounded-lg border border-fd-border bg-fd-card p-2 text-center transition-colors hover:bg-fd-accent"
                title={`ID: ${blip.id} — ${blip.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blip.imageUrl} alt={blip.name} className="h-8 w-8 object-contain" loading="lazy" />
                <span className="text-[10px] font-mono text-fd-muted-foreground">{blip.id}</span>
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
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {colors.map((color) => (
            <div key={color.id} className="flex items-center gap-3 rounded-lg border border-fd-border bg-fd-card p-3 transition-colors hover:bg-fd-accent">
              <div className="h-9 w-9 flex-shrink-0 rounded-md border border-fd-border" style={{ backgroundColor: color.hex }} />
              <div className="min-w-0">
                <div className="truncate text-xs font-medium">{color.name}</div>
                <div className="font-mono text-[10px] text-fd-muted-foreground">{color.id} · {color.hex}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GameReferencePageShell>
  );
}