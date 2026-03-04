"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Zap } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination } from "../_components/page-shell";

interface GameEvent { name: string; description: string }
interface ApiResponse {
  success: boolean; count: number; data: GameEvent[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function GameEventsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/game-events?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, offset]);

  const events = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Zap}
      iconColor="text-yellow-500"
      iconBg="from-yellow-500/20 to-yellow-600/5 border-yellow-500/20"
      title="Game Events"
      description="Client-side game events you can listen to with AddEventHandler in your scripts."
      badge={metadata ? `${metadata.total.toLocaleString()} events` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search event name…"
          onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
        />
      }
    >
      {isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-fd-muted" />
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{events.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? events.length}</span> events
          </p>
          <div className="space-y-2">
            {events.map((ev) => (
              <div key={ev.name} className="rounded-xl border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent/50">
                <div className="font-mono text-sm font-semibold text-fd-foreground">{ev.name}</div>
                {ev.description && (
                  <p className="mt-1 text-sm text-fd-muted-foreground leading-relaxed">{ev.description}</p>
                )}
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