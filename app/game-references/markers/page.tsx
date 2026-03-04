"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Layers } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch } from "../_components/page-shell";

interface Marker { id: number; name: string; imageUrl: string }
interface ApiResponse {
  success: boolean; count: number; data: Marker[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

export default function MarkersPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const url = `${API_URL}/api/game-references/markers?search=${encodeURIComponent(search)}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search]);

  const markers = data?.data ?? [];
  const total = data?.metadata?.total;

  const handleSearch = () => setSearch(inputValue);
  const handleClear = () => { setInputValue(""); setSearch(""); };

  return (
    <GameReferencePageShell
      icon={Layers}
      iconColor="text-orange-500"
      iconBg="from-orange-500/20 to-orange-600/5 border-orange-500/20"
      title="World Markers"
      description={<>All 3D marker types available via <code>DRAW_MARKER</code> (IDs 0–43).</>}
      badge={total ? `${total} marker types` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search markers…"
          onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
        />
      }
    >
      {isPending ? (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
          {Array.from({ length: 44 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-fd-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="group flex flex-col items-center gap-2 rounded-xl border border-fd-border bg-fd-card p-3 text-center transition-colors hover:bg-fd-accent hover:border-fd-border/80"
              title={`ID: ${marker.id} — ${marker.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={marker.imageUrl} alt={marker.name} className="h-14 w-14 object-contain" loading="lazy" />
              <div>
                <div className="font-mono text-xs font-semibold text-fd-foreground">{marker.id}</div>
                {marker.name && (
                  <div className="text-[10px] text-fd-muted-foreground leading-tight mt-0.5">{marker.name}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </GameReferencePageShell>
  );
}