"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Network } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination } from "../_components/page-shell";

interface NetGameEvent { id: number; name: string }
interface ApiResponse {
  success: boolean; count: number; data: NetGameEvent[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function NetGameEventsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/net-game-events?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, offset]);

  const events = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Network}
      iconColor="text-sky-500"
      iconBg="from-sky-500/20 to-sky-600/5 border-sky-500/20"
      title="Net Game Events"
      description={<>All <code>GTA_EVENT_IDS</code> enum entries with sequential IDs for network event handling.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} events` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search event name…"
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
            Showing <span className="font-medium text-fd-foreground">{events.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? events.length}</span> events
          </p>
          <div className="rounded-xl border border-fd-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/40 border-b border-fd-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground w-16">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Event Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {events.map((ev) => (
                  <tr key={ev.id} className="transition-colors hover:bg-fd-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{ev.id}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-foreground">{ev.name}</td>
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