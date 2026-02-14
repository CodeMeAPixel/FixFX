"use client";

import * as React from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/packages/ui/src/components/scroll-area";
import { Badge } from "@/packages/ui/src/components/badge";
import { Button } from "@/packages/ui/src/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/packages/ui/src/components/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/packages/ui/src/components/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui/src/components/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/packages/ui/src/components/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/packages/ui/src/components/accordion";
import { Separator } from "@/packages/ui/src/components/separator";
import { cn } from "@/packages/utils/src/functions/cn";
import { API_URL } from "@/packages/utils/src/constants/link";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Braces,
  FileJson,
  Eraser,
  Play,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
  ArrowRight,
  Code2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { FixFXIcon } from "@/packages/ui/src/icons";

// Types
interface ValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning" | "info";
}

interface ValidationResult {
  valid: boolean;
  type: string;
  issues: ValidationIssue[];
  formatted?: string;
  parseError?: string;
}

interface ValidatorInfoResponse {
  types: { value: string; label: string; description: string }[];
  placeholders: { name: string; description: string }[];
  limits: {
    embed: Record<string, number>;
    config: Record<string, number>;
  };
}

type ValidationType = "generic" | "txadmin-embed" | "txadmin-embed-config";

// Sample JSONs for quick-start
const SAMPLE_EMBED_JSON = `{
    "title": "{{serverName}}",
    "url": "{{serverBrowserUrl}}",
    "description": "Server status embed configured with txAdmin.",
    "fields": [
        {
            "name": "> STATUS",
            "value": "\`\`\`\\n{{statusString}}\\n\`\`\`",
            "inline": true
        },
        {
            "name": "> PLAYERS",
            "value": "\`\`\`\\n{{serverClients}}/{{serverMaxClients}}\\n\`\`\`",
            "inline": true
        },
        {
            "name": "> UPTIME",
            "value": "\`\`\`\\n{{uptime}}\\n\`\`\`",
            "inline": true
        }
    ]
}`;

const SAMPLE_CONFIG_JSON = `{
    "onlineString": "🟢 Online",
    "onlineColor": "#0BA70B",
    "partialString": "🟡 Partial",
    "partialColor": "#FFF100",
    "offlineString": "🔴 Offline",
    "offlineColor": "#A70B28",
    "buttons": [
        {
            "emoji": "1062338355909640233",
            "label": "Connect",
            "url": "{{serverJoinUrl}}"
        }
    ]
}`;

export function ValidatorContent() {
  const [jsonInput, setJsonInput] = useState("");
  const [validationType, setValidationType] =
    useState<ValidationType>("generic");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [validatorInfo, setValidatorInfo] =
    useState<ValidatorInfoResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch validator info on mount
  useEffect(() => {
    fetch(`${API_URL}/api/validator/info`)
      .then((res) => res.json())
      .then((data) => setValidatorInfo(data))
      .catch(console.error);
  }, []);

  const validate = useCallback(async () => {
    if (!jsonInput.trim()) return;

    setIsValidating(true);
    try {
      const response = await fetch(`${API_URL}/api/validator/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: jsonInput,
          type: validationType,
        }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      // Fallback: client-side JSON parse check
      try {
        const parsed = JSON.parse(jsonInput);
        const formatted = JSON.stringify(parsed, null, 4);
        setResult({
          valid: true,
          type: validationType,
          issues: [],
          formatted,
        });
      } catch (parseErr) {
        setResult({
          valid: false,
          type: validationType,
          issues: [],
          parseError:
            parseErr instanceof Error
              ? parseErr.message
              : "Invalid JSON syntax",
        });
      }
    } finally {
      setIsValidating(false);
    }
  }, [jsonInput, validationType]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 4));
    } catch {
      // If it can't be parsed, trigger validation to show the error
      validate();
    }
  }, [jsonInput, validate]);

  const handleClear = useCallback(() => {
    setJsonInput("");
    setResult(null);
  }, []);

  const handleCopyFormatted = useCallback(() => {
    if (result?.formatted) {
      navigator.clipboard.writeText(result.formatted);
      setCopiedFormatted(true);
      setTimeout(() => setCopiedFormatted(false), 2000);
    }
  }, [result]);

  const loadSample = useCallback(
    (type: ValidationType) => {
      setValidationType(type);
      if (type === "txadmin-embed") {
        setJsonInput(SAMPLE_EMBED_JSON);
      } else if (type === "txadmin-embed-config") {
        setJsonInput(SAMPLE_CONFIG_JSON);
      }
      setResult(null);
    },
    [],
  );

  // Keyboard shortcut: Ctrl+Enter to validate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        validate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validate]);

  const severityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
      default:
        return null;
    }
  };

  const severityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "error":
        return "destructive" as const;
      case "warning":
        return "warning" as const;
      case "info":
        return "info" as const;
      default:
        return "secondary" as const;
    }
  };

  const errorCount =
    result?.issues.filter((i) => i.severity === "error").length ?? 0;
  const warningCount =
    result?.issues.filter((i) => i.severity === "warning").length ?? 0;
  const infoCount =
    result?.issues.filter((i) => i.severity === "info").length ?? 0;

  return (
    <div className="relative flex min-h-screen h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.1),rgba(255,255,255,0))]" />
        <div className="absolute left-0 top-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-full bg-fd-background backdrop-blur-sm border-r border-[#5865F2]/20 shadow-lg transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-72",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/20">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <FixFXIcon className="h-5 w-5 text-[#5865F2]" />
              <span className="font-semibold text-white">JSON Validator</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn("h-8 w-8", sidebarCollapsed && "ml-auto")}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[#5865F2]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[#5865F2]" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {!sidebarCollapsed ? (
            <div className="p-4 space-y-6">
              {/* Validation Type */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Validation Mode
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      value: "generic" as ValidationType,
                      label: "Generic JSON",
                      icon: <Braces className="h-4 w-4" />,
                      color: "text-gray-400",
                    },
                    {
                      value: "txadmin-embed" as ValidationType,
                      label: "txAdmin Embed",
                      icon: <Bot className="h-4 w-4" />,
                      color: "text-green-500",
                    },
                    {
                      value: "txadmin-embed-config" as ValidationType,
                      label: "txAdmin Config",
                      icon: <FileJson className="h-4 w-4" />,
                      color: "text-amber-500",
                    },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setValidationType(type.value);
                        setResult(null);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                        validationType === type.value
                          ? "bg-[#5865F2]/20 text-white border border-[#5865F2]/40"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-white border border-transparent",
                      )}
                    >
                      <span className={type.color}>{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#5865F2]/20" />

              {/* Quick Templates */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Quick Templates
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs"
                    onClick={() => loadSample("txadmin-embed")}
                  >
                    <Bot className="h-3.5 w-3.5 text-green-500" />
                    txAdmin Embed Example
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs"
                    onClick={() => loadSample("txadmin-embed-config")}
                  >
                    <FileJson className="h-3.5 w-3.5 text-amber-500" />
                    txAdmin Config Example
                  </Button>
                </div>
              </div>

              <Separator className="bg-[#5865F2]/20" />

              {/* Placeholders Reference */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  txAdmin Placeholders
                </h3>
                <div className="space-y-1.5">
                  {(
                    validatorInfo?.placeholders ?? [
                      { name: "serverName", description: "Server name" },
                      {
                        name: "serverClients",
                        description: "Players online",
                      },
                      {
                        name: "serverMaxClients",
                        description: "Max players",
                      },
                      { name: "statusString", description: "Status text" },
                      { name: "uptime", description: "Server uptime" },
                      {
                        name: "nextScheduledRestart",
                        description: "Next restart",
                      },
                      { name: "serverJoinUrl", description: "Join URL" },
                      {
                        name: "serverBrowserUrl",
                        description: "Browser URL",
                      },
                      { name: "serverCfxId", description: "Cfx.re ID" },
                      { name: "statusColor", description: "Status color" },
                    ]
                  ).map((p) => (
                    <TooltipProvider key={p.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-muted/50 hover:text-white transition-colors group"
                            onClick={() => {
                              const placeholder = `{{${p.name}}}`;
                              if (textareaRef.current) {
                                const start =
                                  textareaRef.current.selectionStart;
                                const end = textareaRef.current.selectionEnd;
                                const newValue =
                                  jsonInput.substring(0, start) +
                                  placeholder +
                                  jsonInput.substring(end);
                                setJsonInput(newValue);
                                // Restore cursor position after placeholder
                                setTimeout(() => {
                                  if (textareaRef.current) {
                                    const newPos =
                                      start + placeholder.length;
                                    textareaRef.current.selectionStart =
                                      newPos;
                                    textareaRef.current.selectionEnd = newPos;
                                    textareaRef.current.focus();
                                  }
                                }, 0);
                              }
                            }}
                          >
                            <code className="text-[#5865F2] group-hover:text-[#7289da] font-mono">
                              {`{{${p.name}}}`}
                            </code>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-xs">{p.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click to insert at cursor
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#5865F2]/20" />

              {/* Useful Links */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Useful Links
                </h3>
                <div className="space-y-2">
                  <a
                    href="https://discohook.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-muted/50 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Discohook — Embed Builder
                  </a>
                  <a
                    href="https://jsoneditoronline.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-muted/50 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    JSON Editor Online
                  </a>
                  <Link
                    href="/docs/txadmin"
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-muted/50 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    txAdmin Documentation
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed sidebar icons */
            <div className="flex flex-col items-center py-4 space-y-4">
              <TooltipProvider>
                {[
                  {
                    value: "generic" as ValidationType,
                    icon: <Braces className="h-4 w-4" />,
                    label: "Generic JSON",
                  },
                  {
                    value: "txadmin-embed" as ValidationType,
                    icon: <Bot className="h-4 w-4" />,
                    label: "txAdmin Embed",
                  },
                  {
                    value: "txadmin-embed-config" as ValidationType,
                    icon: <FileJson className="h-4 w-4" />,
                    label: "txAdmin Config",
                  },
                ].map((type) => (
                  <Tooltip key={type.value}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          validationType === type.value ? "default" : "ghost"
                        }
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => {
                          setValidationType(type.value);
                          setResult(null);
                        }}
                      >
                        {type.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{type.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#5865F2]/20 bg-fd-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-[#5865F2]" />
              <h1 className="text-lg font-semibold">JSON Validator</h1>
            </div>
            <Badge variant="cfx" size="sm">
              {validationType === "generic"
                ? "Generic"
                : validationType === "txadmin-embed"
                  ? "txAdmin Embed"
                  : "txAdmin Config"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile validation type selector */}
            <div className="md:hidden">
              <select
                value={validationType}
                onChange={(e) => {
                  setValidationType(e.target.value as ValidationType);
                  setResult(null);
                }}
                className="bg-muted border border-border rounded-md px-2 py-1 text-sm"
              >
                <option value="generic">Generic JSON</option>
                <option value="txadmin-embed">txAdmin Embed</option>
                <option value="txadmin-embed-config">txAdmin Config</option>
              </select>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFormat}
                    disabled={!jsonInput.trim()}
                    className="gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Format</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Format/prettify JSON</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    disabled={!jsonInput.trim()}
                    className="gap-1.5"
                  >
                    <Eraser className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear editor</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={validate}
              disabled={!jsonInput.trim() || isValidating}
              className="gap-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white"
            >
              <Play className="h-3.5 w-3.5" />
              {isValidating ? "Validating..." : "Validate"}
            </Button>
          </div>
        </div>

        {/* Editor + Results */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* JSON Input */}
          <div className="flex-1 flex flex-col min-h-0 lg:border-r border-[#5865F2]/10">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileJson className="h-4 w-4" />
                <span>Input</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Ctrl+Enter to validate
              </span>
            </div>
            <div className="flex-1 relative min-h-0">
              <textarea
                ref={textareaRef}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  if (result) setResult(null);
                }}
                placeholder={`Paste your JSON here...\n\nOr select a template from the sidebar to get started.`}
                spellCheck={false}
                className={cn(
                  "absolute inset-0 w-full h-full resize-none p-4 font-mono text-sm",
                  "bg-transparent text-fd-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:ring-0 border-0",
                  "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
                  result && !result.valid && "text-red-400/90",
                )}
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="flex-1 flex flex-col min-h-0 lg:max-w-[50%]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>Results</span>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  {errorCount > 0 && (
                    <Badge variant="destructive" size="sm">
                      {errorCount} error{errorCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {warningCount > 0 && (
                    <Badge variant="warning" size="sm">
                      {warningCount} warning{warningCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {infoCount > 0 && (
                    <Badge variant="info" size="sm">
                      {infoCount} info
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Braces className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Paste JSON and click Validate to see results
                      </p>
                      <p className="text-muted-foreground/50 text-xs mt-2">
                        Supports generic JSON, txAdmin embed, and txAdmin config
                        validation
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Status Banner */}
                      {result.parseError ? (
                        <Alert className="border-red-500/50 bg-red-500/10">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <AlertTitle className="text-red-500">
                            Parse Error
                          </AlertTitle>
                          <AlertDescription className="text-red-400 font-mono text-xs mt-2 whitespace-pre-wrap">
                            {result.parseError}
                          </AlertDescription>
                        </Alert>
                      ) : result.valid ? (
                        <Alert className="border-green-500/50 bg-green-500/10">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <AlertTitle className="text-green-500">
                            Valid JSON
                          </AlertTitle>
                          <AlertDescription className="text-green-400 text-sm">
                            {result.issues.length === 0
                              ? "No issues found. Your JSON is valid!"
                              : `JSON is valid with ${result.issues.length} suggestion${result.issues.length !== 1 ? "s" : ""}.`}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="border-red-500/50 bg-red-500/10">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <AlertTitle className="text-red-500">
                            Validation Failed
                          </AlertTitle>
                          <AlertDescription className="text-red-400 text-sm">
                            Found {errorCount} error
                            {errorCount !== 1 ? "s" : ""} that must be fixed.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Issues List */}
                      {result.issues.length > 0 && (
                        <Card className="border-border/50 bg-fd-background/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">
                              Issues ({result.issues.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {result.issues.map((issue, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                                  issue.severity === "error" &&
                                    "border-red-500/30 bg-red-500/5",
                                  issue.severity === "warning" &&
                                    "border-amber-500/30 bg-amber-500/5",
                                  issue.severity === "info" &&
                                    "border-blue-500/30 bg-blue-500/5",
                                )}
                              >
                                {severityIcon(issue.severity)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant={severityBadgeVariant(
                                        issue.severity,
                                      )}
                                      size="sm"
                                    >
                                      {issue.severity}
                                    </Badge>
                                    <code className="text-xs text-muted-foreground font-mono truncate">
                                      {issue.path}
                                    </code>
                                  </div>
                                  <p className="text-sm text-fd-foreground/80">
                                    {issue.message}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* Formatted Output */}
                      {result.formatted && (
                        <Card className="border-border/50 bg-fd-background/50">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                Formatted Output
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyFormatted}
                                className="h-7 gap-1.5 text-xs"
                              >
                                {copiedFormatted ? (
                                  <>
                                    <Check className="h-3 w-3 text-green-500" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <pre className="text-xs font-mono text-fd-foreground/80 overflow-auto max-h-[400px] p-3 rounded-lg bg-muted/30 border border-border/30 scrollbar-thin">
                              {result.formatted}
                            </pre>
                          </CardContent>
                        </Card>
                      )}

                      {/* Limits Reference - show for txAdmin types */}
                      {validationType !== "generic" && validatorInfo?.limits && (
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value="limits"
                            className="border-border/50"
                          >
                            <AccordionTrigger className="text-sm text-muted-foreground hover:text-fd-foreground py-2">
                              <div className="flex items-center gap-2">
                                <Info className="h-3.5 w-3.5" />
                                Discord Embed Limits
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                {validationType === "txadmin-embed" &&
                                  Object.entries(
                                    validatorInfo.limits.embed,
                                  ).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex items-center justify-between px-3 py-1.5 rounded bg-muted/30 text-xs"
                                    >
                                      <span className="text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}
                                      </span>
                                      <span className="font-mono text-fd-foreground">
                                        {value}
                                      </span>
                                    </div>
                                  ))}
                                {validationType === "txadmin-embed-config" &&
                                  Object.entries(
                                    validatorInfo.limits.config,
                                  ).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex items-center justify-between px-3 py-1.5 rounded bg-muted/30 text-xs"
                                    >
                                      <span className="text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}
                                      </span>
                                      <span className="font-mono text-fd-foreground">
                                        {value}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
