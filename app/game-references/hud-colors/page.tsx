"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Palette } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination, ReferenceTabs } from "../_components/page-shell";

interface HUDColor { index: number; name: string; r: number; g: number; b: number; a: number; hex: string }
interface ApiResponse {
  success: boolean; count: number; data: HUDColor[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function HUDColorsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [view, setView] = useState<"swatches" | "table">("swatches");

  const url = `${API_URL}/api/game-references/hud-colors?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, offset]);

  const colors = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Palette}
      iconColor="text-fuchsia-500"
      iconBg="from-fuchsia-500/20 to-fuchsia-600/5 border-fuchsia-500/20"
      title="HUD Colors"
      description={<>All HUD colour indices with RGBA values and hex codes. Use with <code>HUD_COLOUR_*</code> constants.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} colors` : undefined}
      controls={
        <div className="space-y-3">
          <ReferenceTabs
            tabs={[{ id: "swatches", label: "Swatches" }, { id: "table", label: "Table" }]}
            active={view}
            onChange={(v) => setView(v as "swatches" | "table")}
          />
          <ReferenceSearch
            value={inputValue} placeholder="Search color name or index…"
            onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
          />
        </div>
      }
    >
      {isPending ? (
        view === "swatches" ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-fd-muted" />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">{Array.from({ length: 15 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-fd-muted" />)}</div>
        )
      ) : view === "swatches" ? (
        <>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
            {colors.map((c) => (
              <div
                key={c.index}
                className="group flex flex-col items-center gap-1.5 rounded-lg border border-fd-border bg-fd-card p-2 text-center transition-colors hover:bg-fd-accent cursor-default"
                title={`${c.index}: ${c.name} — ${c.hex}`}
              >
                <div className="h-8 w-8 rounded-md border border-fd-border/60 shadow-sm" style={{ backgroundColor: c.hex }} />
                <span className="text-[10px] font-mono text-fd-muted-foreground leading-tight">{c.index}</span>
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
        <>
          <div className="rounded-xl border border-fd-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/40 border-b border-fd-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground w-12">Idx</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Swatch</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden sm:table-cell">Hex</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden md:table-cell">RGBA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {colors.map((c) => (
                  <tr key={c.index} className="transition-colors hover:bg-fd-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{c.index}</td>
                    <td className="px-4 py-2.5 text-xs text-fd-foreground">{c.name}</td>
                    <td className="px-4 py-2.5"><div className="h-5 w-5 rounded border border-fd-border" style={{ backgroundColor: c.hex }} /></td>
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground hidden sm:table-cell">{c.hex}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground hidden md:table-cell">{c.r}, {c.g}, {c.b}, {c.a}</td>
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