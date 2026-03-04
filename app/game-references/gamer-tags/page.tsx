"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Tag } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch } from "../_components/page-shell";

interface GamerTagComponent { id: number; name: string }
interface ApiResponse {
  success: boolean; count: number; data: GamerTagComponent[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

export default function GamerTagsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const url = `${API_URL}/api/game-references/gamer-tags?search=${encodeURIComponent(search)}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search]);

  const components = data?.data ?? [];
  const total = data?.metadata?.total;

  const handleSearch = () => setSearch(inputValue);
  const handleClear = () => { setInputValue(""); setSearch(""); };

  return (
    <GameReferencePageShell
      icon={Tag}
      iconColor="text-pink-500"
      iconBg="from-pink-500/20 to-pink-600/5 border-pink-500/20"
      title="Gamer Tags"
      description={<>Head display component IDs for use with <code>SET_MULTIPLAYER_HANGER_COLOUR</code> and related natives.</>}
      badge={total ? `${total.toLocaleString()} components` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search component name…"
          onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
        />
      }
    >
      {isPending ? (
        <div className="space-y-1.5 max-w-lg">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-fd-muted" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-fd-border overflow-hidden max-w-lg">
          <table className="w-full text-sm">
            <thead className="bg-fd-muted/40 border-b border-fd-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-fd-foreground w-16">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Component Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fd-border">
              {components.map((comp) => (
                <tr key={comp.id} className="transition-colors hover:bg-fd-muted/30">
                  <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{comp.id}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-fd-foreground">{comp.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GameReferencePageShell>
  );
}