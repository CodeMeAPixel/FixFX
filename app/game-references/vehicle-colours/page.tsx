"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { PaintBucket } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination, ReferenceFilterChips, ReferenceTabs } from "../_components/page-shell";

interface VehicleColour { index: number; name: string; type: string; imageUrl: string }
interface ApiResponse {
  success: boolean; count: number; data: VehicleColour[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 200;
const TYPE_OPTIONS = ["metallic", "matte", "metals", "unnamed"];

export default function VehicleColoursPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [colourType, setColourType] = useState("");
  const [offset, setOffset] = useState(0);
  const [view, setView] = useState<"swatches" | "table">("swatches");

  const url = `${API_URL}/api/game-references/vehicle-colours?search=${encodeURIComponent(search)}&type=${encodeURIComponent(colourType)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, colourType, offset]);

  const colours = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };
  const handleType = (t: string) => { setColourType(t); setOffset(0); };

  const typeLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <GameReferencePageShell
      icon={PaintBucket}
      iconColor="text-orange-500"
      iconBg="from-orange-500/20 to-orange-600/5 border-orange-500/20"
      title="Vehicle Colours"
      description={<>All vehicle paint colour indices, grouped by type — metallic, matte, metals, and unnamed. Use with <code>SET_VEHICLE_COLOURS</code> and related natives.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} colours` : undefined}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <ReferenceTabs
              tabs={[{ id: "swatches", label: "Swatches" }, { id: "table", label: "Table" }]}
              active={view}
              onChange={(v) => setView(v as "swatches" | "table")}
            />
          </div>
          <ReferenceFilterChips
            allLabel="All types"
            options={TYPE_OPTIONS}
            value={colourType}
            onChange={handleType}
            formatLabel={typeLabel}
          />
          <ReferenceSearch
            value={inputValue} placeholder="Search colour name or index…"
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
          <div className="space-y-1.5">
            {Array.from({ length: 15 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-fd-muted" />)}
          </div>
        )
      ) : view === "swatches" ? (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{colours.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? colours.length}</span> colours
            {colourType && <> — <span className="font-medium text-fd-foreground">{typeLabel(colourType)}</span></>}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
            {colours.map((c) => (
              <div
                key={c.index}
                className="group flex flex-col items-center gap-1.5 rounded-lg border border-fd-border bg-fd-card p-2 text-center transition-colors hover:bg-fd-accent cursor-default"
                title={`${c.index}: ${c.name} (${c.type})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.imageUrl}
                  alt={`Colour ${c.index}`}
                  className="h-8 w-8 rounded-md border border-fd-border/60 object-cover"
                  loading="lazy"
                />
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
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Preview</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden sm:table-cell">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {colours.map((c) => (
                  <tr key={c.index} className="transition-colors hover:bg-fd-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{c.index}</td>
                    <td className="px-4 py-2.5 text-xs text-fd-foreground">{c.name}</td>
                    <td className="px-4 py-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.imageUrl} alt={`Colour ${c.index}`} className="h-5 w-5 rounded border border-fd-border object-cover" loading="lazy" />
                    </td>
                    <td className="px-4 py-2.5 text-xs text-fd-muted-foreground hidden sm:table-cell capitalize">{c.type}</td>
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
