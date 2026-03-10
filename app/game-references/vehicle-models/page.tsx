"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Car } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination, ReferenceFilterChips } from "../_components/page-shell";

interface VehicleModel { displayName: string; modelName: string; hash: string; category: string; imageUrl: string }
interface ApiResponse {
  success: boolean; count: number; data: VehicleModel[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean; categories: string[] };
}

const LIMIT = 50;

export default function VehicleModelsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [category, setCategory] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/vehicle-models?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, category, offset]);

  const vehicles = data?.data ?? [];
  const metadata = data?.metadata;
  const categories = metadata?.categories ?? [];

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };
  const handleCategory = (cat: string) => { setCategory(cat); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Car}
      iconColor="text-blue-500"
      iconBg="from-blue-500/20 to-blue-600/5 border-blue-500/20"
      title="Vehicle Models"
      description={<>All GTA V / FiveM vehicle model names and hashes, grouped by category. Use model names with <code>GET_HASH_KEY</code> or <code>REQUEST_MODEL</code>.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} vehicles` : undefined}
      controls={
        <div className="space-y-3">
          <ReferenceFilterChips
            allLabel="All categories"
            options={categories}
            value={category}
            onChange={handleCategory}
          />
          <ReferenceSearch
            value={inputValue} placeholder="Search vehicle name or model…"
            onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
          />
        </div>
      }
    >
      {isPending ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-fd-muted" />
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{vehicles.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? vehicles.length}</span> vehicles
            {category && <> in <span className="font-medium text-fd-foreground">"{category}"</span></>}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
            {vehicles.map((v) => (
              <div
                key={`${v.modelName}-${v.hash}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-fd-border bg-fd-card p-2 text-center transition-colors hover:bg-fd-accent"
                title={`${v.displayName} — ${v.modelName} (${v.hash})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.imageUrl}
                  alt={v.displayName}
                  className="h-16 w-full object-contain rounded-md"
                  loading="lazy"
                />
                <div className="w-full">
                  <div className="text-[11px] font-medium truncate text-fd-foreground leading-tight">{v.displayName}</div>
                  <div className="font-mono text-[9px] truncate text-fd-muted-foreground">{v.modelName}</div>
                </div>
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
