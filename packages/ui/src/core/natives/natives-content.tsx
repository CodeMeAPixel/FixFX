"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@ui/components/button";
import { ScrollArea } from "@ui/components/scroll-area";
import { Badge } from "@ui/components/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/tooltip";
import { useFetch } from "@core/useFetch";
import {
  Code,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Hash,
  FileCode,
  Server,
  Monitor,
  Layers,
} from "lucide-react";
import { cn } from "@utils/functions/cn";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { motion } from "motion/react";

interface Native {
  name: string;
  params: {
    name: string;
    type: string;
    description?: string;
  }[];
  results: string;
  description: string;
  hash: string;
  jhash?: string;
  ns: string;
  resultsDescription?: string;
  environment: "client" | "server" | "shared";
  apiset?: string;
  url?: string;
  category: string;
  game?: string;
  isCfx?: boolean;
}

interface NativesContentProps {
  game: "gta5" | "rdr3";
  environment: "all" | "client" | "server";
  category: string;
  searchQuery: string;
  includeCFX: boolean;
}

export function NativesContent({
  game,
  environment,
  category,
  searchQuery,
  includeCFX,
}: NativesContentProps) {
  const [page, setPage] = useState(1);
  const [expandedNative, setExpandedNative] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Track filter changes to reset pagination
  const prevFilters = useRef({
    game,
    environment,
    category,
    searchQuery,
    includeCFX,
  });

  useEffect(() => {
    const currentFilters = {
      game,
      environment,
      category,
      searchQuery,
      includeCFX,
    };
    if (
      JSON.stringify(prevFilters.current) !== JSON.stringify(currentFilters)
    ) {
      setPage(1); // Reset to first page when filters change
      prevFilters.current = currentFilters;
    }
  }, [game, environment, category, searchQuery, includeCFX]);

  // Construct API URL with all parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      game,
      limit: "20",
      offset: ((page - 1) * 20).toString(),
      includeCfx: includeCFX.toString(),
    });

    if (environment !== "all") params.set("environment", environment);
    if (category) params.set("namespace", category);
    if (searchQuery) params.set("search", searchQuery);

    return `${API_URL}/api/natives?${params.toString()}`;
  }, [game, environment, category, searchQuery, includeCFX, page]);

  // Use the enhanced fetch hook
  const { data, isPending, error, refetch } = useFetch<{
    data: Native[];
    metadata: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
      environmentStats: {
        client?: number;
        server?: number;
        shared?: number;
        total?: number;
      };
    };
  }>(apiUrl);

  const natives = data?.data || [];
  const metadata = data?.metadata;
  const totalResults = metadata?.total || 0;
  const totalPages = Math.ceil((metadata?.total || 0) / 20);
  const totalEnvironmentStats = metadata?.environmentStats;

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText("0x" + hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const toggleExpandedNative = (hash: string) => {
    setExpandedNative(expandedNative === hash ? null : hash);
  };

  const renderNative = (native: Native) => {
    const isCfx = native.ns === "CFX" || native.isCfx;

    const environmentClass =
      native.environment === "server"
        ? "from-green-500/5 to-transparent border-l-green-500/50"
        : native.environment === "shared"
          ? "from-purple-500/5 to-transparent border-l-purple-500/50"
          : "from-blue-500/5 to-transparent border-l-blue-500/50";

    const environmentLabel =
      native.environment === "server"
        ? "Server"
        : native.environment === "shared"
          ? "Shared"
          : "Client";

    const environmentBadgeClass =
      native.environment === "server"
        ? "bg-green-500/20 text-green-300 border-green-500/30"
        : native.environment === "shared"
          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
          : "bg-blue-500/20 text-blue-300 border-blue-500/30";

    /**
     * Pre-processes native description content to convert plain text patterns to markdown
     */
    const preprocessNativeDescription = (content: string): string => {
      if (!content) return content;

      let processed = content;

      // Convert plain URLs to markdown links
      processed = processed.replace(
        /(?<![(\[])(https?:\/\/[^\s<>\])"]+)/g,
        "[$1]($1)",
      );

      // Detect and format code examples (lines that look like code)
      // Pattern: lines starting with common code patterns
      const codePatterns = [
        /^(int|float|bool|void|char|string|BOOL|INT|FLOAT|Vector3)\s+\w+/m, // Variable declarations
        /^\w+\s*[=:]\s*\w+\s*\(/m, // Assignments with function calls
        /^(Example|Result)\s*:/im, // Example labels
        /^\w+\.\w+\(/m, // Method calls like Citizen.CreateThread(
        /^(GET_|SET_|IS_|HAS_|CREATE_|DELETE_|ACTIVATE_|DISABLE_)\w+\(/m, // Native calls
      ];

      // Split into lines and process
      const lines = processed.split("\n");
      let inCodeBlock = false;
      let codeBlockLines: string[] = [];
      const resultLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Check if this line looks like code
        const looksLikeCode =
          codePatterns.some((p) => p.test(trimmedLine)) ||
          /^[\w_]+\s*\(/.test(trimmedLine) || // Function calls
          /^[\w_]+\s*=\s*/.test(trimmedLine) || // Assignments
          /;\s*$/.test(trimmedLine) || // Ends with semicolon
          /^\{|\}$/.test(trimmedLine); // Braces

        // Format contributor comments: [date] username:
        const contributorMatch = trimmedLine.match(
          /^\[(\d{2}\/\d{2}\/\d{4})\]\s*(\w+)\s*:/,
        );
        if (contributorMatch) {
          // End any open code block
          if (inCodeBlock && codeBlockLines.length > 0) {
            resultLines.push("```lua");
            resultLines.push(...codeBlockLines);
            resultLines.push("```");
            codeBlockLines = [];
            inCodeBlock = false;
          }
          // Format as a styled contributor note
          const restOfLine = trimmedLine
            .substring(contributorMatch[0].length)
            .trim();
          resultLines.push("");
          resultLines.push(
            `> **${contributorMatch[2]}** *(${contributorMatch[1]})*${restOfLine ? ": " + restOfLine : ""}`,
          );
          continue;
        }

        // Convert bullet points (- or *) to proper markdown if not already
        if (
          /^[-*]\s+\w/.test(trimmedLine) &&
          !trimmedLine.startsWith("- [") &&
          !trimmedLine.startsWith("* [")
        ) {
          // End any open code block
          if (inCodeBlock && codeBlockLines.length > 0) {
            resultLines.push("```lua");
            resultLines.push(...codeBlockLines);
            resultLines.push("```");
            codeBlockLines = [];
            inCodeBlock = false;
          }
          resultLines.push(line);
          continue;
        }

        if (looksLikeCode && trimmedLine.length > 0) {
          if (!inCodeBlock) {
            inCodeBlock = true;
          }
          codeBlockLines.push(line);
        } else {
          // End code block if we were in one
          if (inCodeBlock && codeBlockLines.length > 0) {
            resultLines.push("```lua");
            resultLines.push(...codeBlockLines);
            resultLines.push("```");
            codeBlockLines = [];
            inCodeBlock = false;
          }
          resultLines.push(line);
        }
      }

      // Close any remaining code block
      if (inCodeBlock && codeBlockLines.length > 0) {
        resultLines.push("```lua");
        resultLines.push(...codeBlockLines);
        resultLines.push("```");
      }

      return resultLines.join("\n");
    };

    const renderMarkdown = (content: string) => {
      const processedContent = preprocessNativeDescription(content);

      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const code = String(children).replace(/\n$/, "");
              const isBlock = !!match || (!className && code.includes("\n"));

              if (isBlock) {
                return (
                  <div className="relative group my-2 rounded-md overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-800 px-2 py-1 text-xs font-mono text-gray-300">
                      <span>{language || "code"}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(code)}
                      >
                        {copiedCode === code ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      language={language || "lua"}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0px",
                        padding: "0.5rem",
                      }}
                      wrapLongLines={true}
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              return (
                <code
                  className="bg-gray-800/50 px-1.5 py-0.5 rounded text-sm font-mono text-amber-300"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p({ children }) {
              // Use div instead of p to avoid hydration errors when code blocks are nested
              return (
                <div className="mb-2 last:mb-0 text-muted-foreground leading-relaxed">
                  {children}
                </div>
              );
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-4 mb-2 space-y-1 text-sm text-muted-foreground">
                  {children}
                </ul>
              );
            },
            li({ children }) {
              return <li className="leading-relaxed">{children}</li>;
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1"
                >
                  {children}
                  <ExternalLink className="h-3 w-3" />
                </a>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-blue-500/50 pl-3 my-2 text-sm italic text-muted-foreground bg-blue-500/5 py-1 rounded-r">
                  {children}
                </blockquote>
              );
            },
            strong({ children }) {
              return (
                <strong className="font-semibold text-fd-foreground">
                  {children}
                </strong>
              );
            },
            em({ children }) {
              return <em className="text-muted-foreground/80">{children}</em>;
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      );
    };

    const handleCopyCode = (code: string) => {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold font-mono flex items-center gap-2 group break-all sm:break-normal">
            <span
              className="truncate max-w-[calc(100%-2rem)]"
              title={native.name}
            >
              {native.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground opacity-50 group-hover:opacity-100 flex-shrink-0"
              onClick={() => handleCopyHash(native.hash)}
            >
              {copiedHash === native.hash ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </h3>

          <div className="text-xs font-mono text-muted-foreground">
            {native.hash} {native.jhash ? `(${native.jhash})` : ""}
          </div>
        </div>

        <div className="mt-2">
          {native.description ? (
            renderMarkdown(native.description)
          ) : (
            <p className="text-sm text-muted-foreground">
              No description available.
            </p>
          )}
        </div>

        {native.params.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Parameters</h4>
            <div className="bg-gray-800/50 rounded-md p-3 space-y-2">
              {native.params.map((param, index) => (
                <div key={index} className="grid grid-cols-[100px_1fr] text-sm">
                  <div className="font-mono text-xs text-blue-400">
                    {param.type}
                  </div>
                  <div>
                    <span className="font-mono text-amber-300">
                      {param.name}
                    </span>
                    {param.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {renderMarkdown(param.description)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-1">Returns</h4>
          <div className="bg-gray-800/50 rounded-md p-3">
            <div className="grid grid-cols-[100px_1fr] text-sm">
              <div className="font-mono text-xs text-blue-400">
                {native.results}
              </div>
              <div className="text-xs text-muted-foreground">
                {native.resultsDescription
                  ? renderMarkdown(native.resultsDescription)
                  : "No return description available."}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs bg-gray-700/50 px-2 py-0.5 rounded text-muted-foreground">
              {native.ns}
            </span>

            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded border ${environmentBadgeClass}`}
            >
              {environmentLabel}
            </span>

            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400 border border-gray-500/10">
              {native.game === "gta5" ? "GTA V" : "RDR3"}
            </span>

            {isCfx && (
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/10">
                CFX
              </span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              setExpandedNative(
                expandedNative === native.hash ? null : native.hash,
              )
            }
          >
            {expandedNative === native.hash ? "Less" : "More"}
          </Button>
        </div>

        {expandedNative === native.hash && (
          <div className="pt-3 mt-2 border-t border-gray-700/50 space-y-3">
            {/* Expanded content */}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 border-b border-fd-border bg-fd-background/80 backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#5865F2]/20">
                <FileCode className="h-4 w-4 text-[#5865F2]" />
              </div>
              {game === "gta5" ? "GTA V" : "RDR3"} Natives
              {includeCFX && (
                <Badge className="bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30 text-xs">
                  +CFX
                </Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isPending ? (
                "Loading..."
              ) : (
                <>
                  <span className="font-medium text-fd-foreground">
                    {totalResults.toLocaleString()}
                  </span>{" "}
                  natives found
                  {searchQuery && (
                    <span className="text-[#5865F2]">
                      {" "}
                      matching "{searchQuery}"
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {totalEnvironmentStats && (
            <div className="flex items-center gap-4 px-3 py-2 rounded-xl bg-fd-muted/30 border border-fd-border">
              <div className="flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-medium">
                  {(totalEnvironmentStats.client ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Client</span>
              </div>
              <div className="w-px h-4 bg-fd-border" />
              <div className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs font-medium">
                  {(totalEnvironmentStats.server ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Server</span>
              </div>
              <div className="w-px h-4 bg-fd-border" />
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-xs font-medium">
                  {(totalEnvironmentStats.shared ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Shared</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {isPending ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-[#5865F2]/20 border-t-[#5865F2] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileCode className="h-5 w-5 text-[#5865F2]/50" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Loading natives...</p>
          </motion.div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md p-6 text-center rounded-2xl border border-red-500/20 bg-red-500/5"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Code className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-400">
              Error loading natives
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {String(error)}
            </p>
            <Button
              onClick={refetch}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      ) : natives.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md p-6 text-center rounded-2xl border border-fd-border bg-fd-muted/30"
          >
            <div className="w-12 h-12 rounded-full bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-4">
              <FileCode className="h-6 w-6 text-[#5865F2]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No natives found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking
              for. You may also need to enable the "Include CFX Natives" option.
            </p>
            {searchQuery && (
              <Button
                onClick={() => (window.location.href = `/natives?game=${game}`)}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {natives.map((native, index) => (
              <motion.div
                key={native.hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={cn(
                  "group relative rounded-xl border bg-fd-background/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg",
                  native.environment === "server" &&
                    "border-green-500/20 hover:border-green-500/40",
                  native.environment === "shared" &&
                    "border-purple-500/20 hover:border-purple-500/40",
                  native.environment === "client" &&
                    "border-blue-500/20 hover:border-blue-500/40",
                )}
              >
                {/* Environment indicator bar */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    native.environment === "server" &&
                      "bg-gradient-to-b from-green-500 via-green-500/50 to-green-500/20",
                    native.environment === "shared" &&
                      "bg-gradient-to-b from-purple-500 via-purple-500/50 to-purple-500/20",
                    native.environment === "client" &&
                      "bg-gradient-to-b from-blue-500 via-blue-500/50 to-blue-500/20",
                  )}
                />

                {/* Gradient overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    native.environment === "server" &&
                      "bg-gradient-to-r from-green-500/5 to-transparent",
                    native.environment === "shared" &&
                      "bg-gradient-to-r from-purple-500/5 to-transparent",
                    native.environment === "client" &&
                      "bg-gradient-to-r from-blue-500/5 to-transparent",
                  )}
                />

                <div className="relative p-4 pl-5">{renderNative(native)}</div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-fd-border bg-fd-background/50">
              <p className="text-sm text-muted-foreground">
                Page{" "}
                <span className="font-medium text-fd-foreground">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-fd-foreground">
                  {totalPages}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="hidden sm:flex"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="hidden sm:flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={`page-${pageNum}`}
                        variant={page === pageNum ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-8 h-8 p-0",
                          page === pageNum &&
                            "bg-[#5865F2] hover:bg-[#5865F2]/90",
                        )}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="hidden sm:flex"
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
