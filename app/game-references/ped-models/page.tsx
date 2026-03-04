"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Users } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination, ReferenceFilterChips } from "../_components/page-shell";

interface PedModel { name: string; category: string; props: number; components: number; imageUrl: string }
interface ApiResponse {
  success: boolean; count: number; data: PedModel[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean; categories: string[] };
}

const LIMIT = 50;

export default function PedModelsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [category, setCategory] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/ped-models?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, category, offset]);

  const peds = data?.data ?? [];
  const metadata = data?.metadata;
  const categories = metadata?.categories ?? [];

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };
  const handleCategory = (cat: string) => { setCategory(cat); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={Users}
      iconColor="text-violet-500"
      iconBg="from-violet-500/20 to-violet-600/5 border-violet-500/20"
      title="Ped Models"
      description={<>All pedestrian models available in GTA V / FiveM. Use model names with <code>GET_HASH_KEY</code> or <code>REQUEST_MODEL</code>.</>}
      badge={metadata ? `${metadata.total.toLocaleString()} models` : undefined}
      controls={
        <div className="space-y-3">
          <ReferenceFilterChips
            allLabel="All categories"
            options={categories}
            value={category}
            onChange={handleCategory}
          />
          <ReferenceSearch
            value={inputValue} placeholder="Search ped model name…"
            onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
          />
        </div>
      }
    >
      {isPending ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-fd-muted" />
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{peds.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? peds.length}</span> peds
            {category && <> in <span className="font-medium text-fd-foreground">"{category}"</span></>}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {peds.map((ped) => (
              <div
                key={ped.name}
                className="group flex flex-col items-center gap-2 rounded-xl border border-fd-border bg-fd-card p-2 text-center transition-colors hover:bg-fd-accent"
                title={`${ped.name} — ${ped.category}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ped.imageUrl} alt={ped.name} className="h-20 w-full object-cover object-top rounded-md" loading="lazy" />
                <div className="w-full">
                  <div className="font-mono text-[10px] truncate text-fd-foreground font-medium">{ped.name}</div>
                  <div className="text-[9px] text-fd-muted-foreground">{ped.props}p · {ped.components}c</div>
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