"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Map } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination } from "../_components/page-shell";

interface Zone { id: number; zoneNameId: string; zoneName: string; description: string }
interface ApiResponse {
  success: boolean; count: number; data: Zone[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function ZonesPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/zones?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, offset]);

  const zones = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Map}
      iconColor="text-teal-500"
      iconBg="from-teal-500/20 to-teal-600/5 border-teal-500/20"
      title="Map Zones"
      description={<>All GTA V map zone identifiers and names. Use with <code>GET_NAME_OF_ZONE</code> and related natives.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} zones` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search zone name or description…"
          onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
        />
      }
    >
      {isPending ? (
        <div className="space-y-1.5">
          {Array.from({ length: 15 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-fd-muted" />)}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{zones.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? zones.length}</span> zones
          </p>
          <div className="rounded-xl border border-fd-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/40 border-b border-fd-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground w-24">Zone ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {zones.map((zone) => (
                  <tr key={zone.zoneNameId} className="transition-colors hover:bg-fd-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-fd-foreground">{zone.zoneNameId}</td>
                    <td className="px-4 py-2.5 text-xs text-fd-foreground">{zone.zoneName}</td>
                    <td className="px-4 py-2.5 text-xs text-fd-muted-foreground hidden md:table-cell">{zone.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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