"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Hash } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination } from "../_components/page-shell";

interface PickupHash { name: string; hash: string }
interface ApiResponse {
  success: boolean; count: number; data: PickupHash[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function PickupHashesPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/pickup-hashes?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, offset]);

  const pickups = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Hash}
      iconColor="text-lime-500"
      iconBg="from-lime-500/20 to-lime-600/5 border-lime-500/20"
      title="Pickup Hashes"
      description={<>All <code>ePickupHashes</code> enum entries with numeric hash values. Use with <code>CREATE_PICKUP_ROTATE</code> and related natives.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} pickups` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search pickup name or hash…"
          onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
        />
      }
    >
      {isPending ? (
        <div className="space-y-1.5">
          {Array.from({ length: 20 }).map((_, i) => <div key={i} className="h-9 animate-pulse rounded-lg bg-fd-muted" />)}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{pickups.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? pickups.length}</span> pickup hashes
          </p>
          <div className="rounded-xl border border-fd-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/40 border-b border-fd-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Pickup Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Hash Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {pickups.map((p, i) => (
                  <tr key={`${p.name}-${i}`} className="transition-colors hover:bg-fd-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-foreground">{p.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{p.hash}</td>
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