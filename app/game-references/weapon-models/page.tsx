"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Sword } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination, ReferenceFilterChips } from "../_components/page-shell";

interface WeaponModel {
  name: string; hash: string; modelHashKey: string; dlc: string;
  description: string; imageUrl: string; group: string;
  components: string[]; tints: string[];
}
interface ApiResponse {
  success: boolean; count: number; data: WeaponModel[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean; groups: string[] };
}

const LIMIT = 50;

export default function WeaponModelsPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [group, setGroup] = useState("");
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const url = `${API_URL}/api/game-references/weapon-models?search=${encodeURIComponent(search)}&group=${encodeURIComponent(group)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, group, offset]);

  const weapons = data?.data ?? [];
  const metadata = data?.metadata;
  const groups = metadata?.groups ?? [];

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };
  const handleGroup = (g: string) => { setGroup(g); setOffset(0); setExpanded(null); };

  return (
    <GameReferencePageShell
      icon={Sword}
      iconColor="text-red-500"
      iconBg="from-red-500/20 to-red-600/5 border-red-500/20"
      title="Weapon Models"
      description="All weapon models with hash keys, DLC info, attachable components, and tint options."
      badge={metadata ? `${metadata.total.toLocaleString()} weapons` : undefined}
      controls={
        <div className="space-y-3">
          <ReferenceFilterChips
            allLabel="All groups"
            options={groups}
            value={group}
            onChange={handleGroup}
          />
          <ReferenceSearch
            value={inputValue} placeholder="Search weapon name or hash…"
            onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
          />
        </div>
      }
    >
      {isPending ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-fd-muted" />)}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{weapons.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? weapons.length}</span> weapons
            {group && <> in <span className="font-medium text-fd-foreground">"{group}"</span></>}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {weapons.map((weapon) => {
              const key = weapon.hash || weapon.name;
              const isExpanded = expanded === key;
              const hasDetails = weapon.description || weapon.components?.length > 0 || weapon.tints?.length > 0;
              return (
                <div key={key} className="rounded-xl border border-fd-border bg-fd-card overflow-hidden transition-colors hover:border-fd-border/80">
                  <div className="flex gap-3 p-4">
                    {weapon.imageUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={weapon.imageUrl} alt={weapon.name} className="h-16 w-24 flex-shrink-0 object-contain" loading="lazy" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate text-fd-foreground">{weapon.name}</div>
                      <div className="font-mono text-xs text-fd-muted-foreground truncate mt-0.5">{weapon.hash}</div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {weapon.group && (
                          <span className="inline-flex items-center rounded-full bg-fd-muted px-2 py-0.5 text-[10px] font-medium text-fd-muted-foreground">{weapon.group}</span>
                        )}
                        {weapon.dlc && weapon.dlc !== "base" && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{weapon.dlc}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {hasDetails && (
                    <div className="border-t border-fd-border">
                      <button
                        className="flex w-full items-center justify-between px-4 py-2 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                        onClick={() => setExpanded(isExpanded ? null : key)}
                      >
                        <span>Details</span>
                        <span className="text-[10px]">{isExpanded ? "▲" : "▼"}</span>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-2.5 text-xs">
                          {weapon.modelHashKey && (
                            <div><span className="text-fd-muted-foreground">Model Hash Key: </span><code className="font-mono">{weapon.modelHashKey}</code></div>
                          )}
                          {weapon.description && (
                            <p className="text-fd-muted-foreground leading-relaxed">{weapon.description}</p>
                          )}
                          {weapon.components?.length > 0 && (
                            <div>
                              <div className="font-medium mb-1.5 text-fd-foreground">Components ({weapon.components.length})</div>
                              <div className="flex flex-wrap gap-1">
                                {weapon.components.map((c) => <code key={c} className="rounded bg-fd-muted px-1.5 py-0.5 text-[10px]">{c}</code>)}
                              </div>
                            </div>
                          )}
                          {weapon.tints?.length > 0 && (
                            <div>
                              <div className="font-medium mb-1.5 text-fd-foreground">Tints ({weapon.tints.length})</div>
                              <div className="flex flex-wrap gap-1">
                                {weapon.tints.map((t) => <span key={t} className="rounded bg-fd-muted px-1.5 py-0.5 text-[10px]">{t}</span>)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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