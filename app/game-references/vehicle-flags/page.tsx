"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Flag } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination } from "../_components/page-shell";

interface VehicleFlag { number: number; name: string; description: string; build: string }
interface ApiResponse {
  success: boolean; count: number; data: VehicleFlag[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function VehicleFlagsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/vehicle-flags?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, offset]);

  const flags = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Flag}
      iconColor="text-red-500"
      iconBg="from-red-500/20 to-red-600/5 border-red-500/20"
      title="Vehicle Flags"
      description={<>All vehicle flag definitions with descriptions and the build version they were introduced in. Use with <code>GET_VEHICLE_HANDLING_FLOAT</code> and related flag natives.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} flags` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search flag name or description…"
          onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
        />
      }
    >
      {isPending ? (
        <div className="space-y-1.5">
          {Array.from({ length: 20 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-fd-muted" />)}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{flags.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? flags.length}</span> flags
          </p>
          <div className="rounded-xl border border-fd-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/40 border-b border-fd-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground w-12">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Flag Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden md:table-cell">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden sm:table-cell w-24">Build</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {flags.map((f) => (
                  <tr key={f.number} className="transition-colors hover:bg-fd-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{f.number}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-foreground">{f.name}</td>
                    <td className="px-4 py-2.5 text-xs text-fd-muted-foreground hidden md:table-cell max-w-md">{f.description}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground hidden sm:table-cell">{f.build || "—"}</td>
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
