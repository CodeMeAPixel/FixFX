"use client";

import { useState } from "react";
import { useFetch } from "@core/useFetch";
import { API_URL } from "@/packages/utils/src/constants/link";
import { FileCode } from "lucide-react";
import { GameReferencePageShell, ReferenceSearch, ReferencePagination } from "../_components/page-shell";

interface DataFile { key: string; fileType: string; rootElement: string; mounter: string; example: string }
interface ApiResponse {
  success: boolean; count: number; data: DataFile[];
  metadata: { total: number; limit: number; offset: number; hasMore: boolean };
}

const LIMIT = 100;

export default function DataFilesPage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(0);

  const url = `${API_URL}/api/game-references/data-files?search=${encodeURIComponent(search)}&limit=${LIMIT}&offset=${offset}`;
  const { data, isPending } = useFetch<ApiResponse>(url, {}, [search, offset]);

  const files = data?.data ?? [];
  const metadata = data?.metadata;

  const handleSearch = () => { setSearch(inputValue); setOffset(0); };
  const handleClear = () => { setInputValue(""); setSearch(""); setOffset(0); };

  return (
    <GameReferencePageShell
      icon={FileCode}
      iconColor="text-cyan-500"
      iconBg="from-cyan-500/20 to-cyan-600/5 border-cyan-500/20"
      title="Data Files"
      description="All valid data_file keys for use in fxmanifest.lua. Use these types in the data_file() directive."
      badge={metadata ? `${metadata.total.toLocaleString()} types` : undefined}
      controls={
        <ReferenceSearch
          value={inputValue} placeholder="Search data file key…"
          onChange={setInputValue} onSearch={handleSearch} onClear={handleClear}
        />
      }
    >
      {isPending ? (
        <div className="space-y-1.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-fd-muted" />
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            Showing <span className="font-medium text-fd-foreground">{files.length}</span> of{" "}
            <span className="font-medium text-fd-foreground">{metadata?.total ?? files.length}</span> data file types
          </p>
          <div className="rounded-xl border border-fd-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/40 border-b border-fd-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground">Key</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden sm:table-cell">File Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden md:table-cell">Root Element</th>
                  <th className="px-4 py-3 text-left font-semibold text-fd-foreground hidden lg:table-cell">Mounter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {files.map((f) => (
                  <tr key={f.key} className="transition-colors hover:bg-fd-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-fd-foreground">{f.key}</td>
                    <td className="px-4 py-2.5 text-xs text-fd-muted-foreground hidden sm:table-cell">{f.fileType}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground hidden md:table-cell">{f.rootElement}</td>
                    <td className="px-4 py-2.5 text-xs text-fd-muted-foreground hidden lg:table-cell">{f.mounter}</td>
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