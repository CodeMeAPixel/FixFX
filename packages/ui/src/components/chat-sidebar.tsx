"use client";

import * as React from "react";
import { cn } from "@utils/functions/cn";
import { NAV_LINKS, DISCORD_LINK, GITHUB_LINK } from "@utils/constants";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import {
  History,
  ChevronLeft,
  ChevronRight,
  Plus,
  Github,
  MessagesSquare,
  Settings,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Slider } from "./slider";
import { Badge } from "./badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { FixFXIcon } from "../icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { FaDiscord } from "react-icons/fa";

const MODELS = [
  { value: "gpt-4o", label: "GPT-4o", group: "OpenAI", isNew: true },
  { value: "gpt-4o-mini", label: "GPT-4o Mini", group: "OpenAI" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo", group: "OpenAI" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", group: "OpenAI" },
  {
    value: "claude-3-5-sonnet",
    label: "Claude 3.5 Sonnet",
    group: "Anthropic",
    byok: "anthropic",
    isNew: true,
  },
  {
    value: "claude-3-haiku",
    label: "Claude 3 Haiku",
    group: "Anthropic",
    byok: "anthropic",
  },
  {
    value: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    group: "Google",
    byok: "google",
    isNew: true,
  },
  {
    value: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    group: "Google",
    byok: "google",
  },
];

function ByokKeyInput({
  provider,
  storageKey,
  placeholder,
  unlocks,
  onKeyChange,
}: {
  provider: string;
  storageKey: string;
  placeholder: string;
  unlocks: string;
  onKeyChange: () => void;
}) {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setKey(stored);
      setSaved(true);
    }
  }, [storageKey]);

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    localStorage.setItem(storageKey, trimmed);
    setSaved(true);
    onKeyChange();
  };

  const handleClear = () => {
    localStorage.removeItem(storageKey);
    setKey("");
    setSaved(false);
    onKeyChange();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-fd-foreground">{provider}</span>
        {saved && (
          <span className="text-[10px] text-emerald-500 flex items-center gap-1">
            <Check className="h-3 w-3" /> Active
          </span>
        )}
      </div>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setSaved(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder={placeholder}
          className="h-8 text-xs font-mono pr-16"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="p-1 rounded text-fd-muted-foreground hover:text-fd-foreground"
          >
            {visible ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </button>
          {saved ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded text-red-400 hover:text-red-300"
              title="Remove key"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={!key.trim()}
              className="p-1 rounded text-[#5865F2] hover:text-[#5865F2]/80 disabled:opacity-40"
              title="Save key"
            >
              <Check className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] text-fd-muted-foreground">Unlocks {unlocks}</p>
    </div>
  );
}

interface SavedChat {
  id: string;
  title: string;
  messages: any[];
  model: string;
  temperature: number;
  timestamp: number;
  preview: string;
}

interface ChatSidebarProps {
  model: string;
  temperature: number;
  onModelChange: (model: string) => void;
  onTemperatureChange: (temperature: number) => void;
  onLoadChat: (chat: SavedChat) => void;
  onNewChat?: () => void;
}

export function ChatSidebar({
  model,
  temperature,
  onModelChange,
  onTemperatureChange,
  onLoadChat,
  onNewChat,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recentChats, setRecentChats] = useState<SavedChat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [byokKeys, setByokKeys] = useState({ anthropic: false, google: false });
  const prevChatsRef = useRef<string>("");

  const refreshByok = () => {
    setByokKeys({
      anthropic: !!localStorage.getItem("fixfx-byok-anthropic"),
      google: !!localStorage.getItem("fixfx-byok-google"),
    });
  };

  const refreshByokAndDispatch = () => {
    refreshByok();
    window.dispatchEvent(new CustomEvent("byokChanged"));
  };

  useEffect(() => {
    refreshByok();
    window.addEventListener("byokChanged", refreshByok);
    return () => window.removeEventListener("byokChanged", refreshByok);
  }, []);

  useEffect(() => {
    const updateActiveChat = () => {
      const currentChatId = localStorage.getItem("fixfx-current-chat");
      setActiveChat(currentChatId);
    };
    updateActiveChat();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "fixfx-current-chat") updateActiveChat();
    };
    const handleActiveChatChanged = () => setTimeout(updateActiveChat, 50);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("activeChatChanged", handleActiveChatChanged);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("activeChatChanged", handleActiveChatChanged);
    };
  }, []);

  useEffect(() => {
    const loadChats = () => {
      const savedChatsStr = localStorage.getItem("fixfx-chats");
      if (!savedChatsStr || savedChatsStr === prevChatsRef.current) return;
      try {
        setRecentChats(JSON.parse(savedChatsStr));
        prevChatsRef.current = savedChatsStr;
      } catch {}
    };
    loadChats();
    const handleChatsUpdated = () => setTimeout(loadChats, 50);
    window.addEventListener("chatsUpdated", handleChatsUpdated);
    return () => window.removeEventListener("chatsUpdated", handleChatsUpdated);
  }, []);

  const handleChatClick = React.useCallback(
    (chat: SavedChat) => {
      localStorage.setItem("fixfx-current-chat", chat.id);
      setActiveChat(chat.id);
      onLoadChat(chat);
    },
    [onLoadChat],
  );

  const getModelDisabled = (m: (typeof MODELS)[0]) => {
    if (!m.byok) return false;
    return !byokKeys[m.byok as keyof typeof byokKeys];
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-full border-r border-fd-border bg-fd-background transition-all duration-300 shrink-0",
          isCollapsed ? "w-14" : "w-72",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center border-b border-fd-border shrink-0",
            isCollapsed ? "justify-center p-3" : "justify-between px-3 py-3",
          )}
        >
          {isCollapsed ? (
            <Link href="/" aria-label="FixFX Home">
              <FixFXIcon className="h-5 w-5 text-[#5865F2]" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <FixFXIcon className="h-5 w-5 text-[#5865F2] shrink-0" />
              <span className="font-semibold text-sm text-fd-foreground truncate">
                Fixie AI
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-7 w-7 shrink-0 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent",
              !isCollapsed && "ml-2",
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* New Chat */}
        <div
          className={cn(
            "px-2 py-2 border-b border-fd-border/50 shrink-0",
            isCollapsed ? "flex justify-center" : "",
          )}
        >
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent"
                  onClick={onNewChat}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Chat</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs justify-start gap-2 font-normal"
              onClick={onNewChat}
            >
              <Plus className="h-3.5 w-3.5" />
              New Chat
            </Button>
          )}
        </div>

        {/* Collapsed: icon-only navigation */}
        {isCollapsed && (
          <ScrollArea className="flex-1">
            <div className="flex flex-col items-center gap-0.5 px-2 py-2">
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8",
                          isActive
                            ? "bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/15"
                            : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent",
                        )}
                        asChild
                      >
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <Link href={item.href}>
                            <Icon className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                );
              })}
              <div className="my-1 w-6 border-t border-fd-border/50" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent"
                    onClick={() => setIsCollapsed(false)}
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Recent Chats</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent"
                    onClick={() => setIsCollapsed(false)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </div>
          </ScrollArea>
        )}

        {/* Expanded: tabbed layout */}
        {!isCollapsed && (
          <Tabs defaultValue="chats" className="flex-1 flex flex-col min-h-0">
            <div className="px-2 pt-2 shrink-0">
              <TabsList className="w-full h-8">
                <TabsTrigger
                  value="chats"
                  className="flex-1 text-xs gap-1.5 h-6"
                >
                  <MessagesSquare className="h-3 w-3" />
                  Chats
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex-1 text-xs gap-1.5 h-6"
                >
                  <Settings className="h-3 w-3" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chats" className="flex-1 mt-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="px-2 py-2 space-y-4">
                  {/* Navigation */}
                  <div>
                    <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-fd-muted-foreground">
                      Navigation
                    </p>
                    <div className="space-y-0.5">
                      {NAV_LINKS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 w-full justify-start gap-2 text-xs font-normal transition-colors",
                              isActive
                                ? "bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/15"
                                : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent",
                            )}
                            asChild
                          >
                            {item.external ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{item.name}</span>
                              </a>
                            ) : (
                              <Link href={item.href}>
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Chats */}
                  <div>
                    <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-fd-muted-foreground">
                      Recent Chats
                    </p>
                    {recentChats.length > 0 ? (
                      <div className="space-y-0.5">
                        {recentChats.slice(0, 12).map((chat) => {
                          const isActive = activeChat === chat.id;
                          return (
                            <Button
                              key={chat.id}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 w-full justify-start text-xs font-normal gap-2",
                                isActive
                                  ? "bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/15"
                                  : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent",
                              )}
                              onClick={() => handleChatClick(chat)}
                            >
                              <History className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{chat.title}</span>
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-2 py-3 text-fd-muted-foreground/60">
                        <MessagesSquare className="h-4 w-4 shrink-0" />
                        <span className="text-xs">No recent chats</span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 mt-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="px-2 py-2 space-y-5">
                  {/* Model Select */}
                  <div className="px-2 space-y-1.5">
                    <Label className="text-xs text-fd-foreground">Model</Label>
                    <Select value={model} onValueChange={onModelChange}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-[10px] py-1 pl-2">
                            OpenAI
                          </SelectLabel>
                          {MODELS.filter((m) => m.group === "OpenAI").map(
                            (m) => (
                              <SelectItem
                                key={m.value}
                                value={m.value}
                                className="text-xs"
                              >
                                <span className="flex items-center gap-1.5">
                                  {m.label}
                                  {m.isNew && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 text-[9px] px-1 py-0"
                                    >
                                      New
                                    </Badge>
                                  )}
                                </span>
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-[10px] py-1 pl-2">
                            Anthropic
                            {!byokKeys.anthropic && (
                              <span className="text-[#5865F2] normal-case font-normal">
                                {" \u00B7 key needed"}
                              </span>
                            )}
                          </SelectLabel>
                          {MODELS.filter((m) => m.group === "Anthropic").map(
                            (m) => (
                              <SelectItem
                                key={m.value}
                                value={m.value}
                                className="text-xs"
                                disabled={getModelDisabled(m)}
                              >
                                <span className="flex items-center gap-1.5">
                                  {m.label}
                                  {m.isNew && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 text-[9px] px-1 py-0"
                                    >
                                      New
                                    </Badge>
                                  )}
                                </span>
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-[10px] py-1 pl-2">
                            Google
                            {!byokKeys.google && (
                              <span className="text-[#5865F2] normal-case font-normal">
                                {" \u00B7 key needed"}
                              </span>
                            )}
                          </SelectLabel>
                          {MODELS.filter((m) => m.group === "Google").map(
                            (m) => (
                              <SelectItem
                                key={m.value}
                                value={m.value}
                                className="text-xs"
                                disabled={getModelDisabled(m)}
                              >
                                <span className="flex items-center gap-1.5">
                                  {m.label}
                                  {m.isNew && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 text-[9px] px-1 py-0"
                                    >
                                      New
                                    </Badge>
                                  )}
                                </span>
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperature */}
                  <div className="px-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-fd-foreground">
                        Temperature
                      </Label>
                      <span className="text-xs tabular-nums text-fd-muted-foreground">
                        {temperature.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={([val]) => onTemperatureChange(val)}
                    />
                    <div className="flex justify-between text-[10px] text-fd-muted-foreground">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  {/* API Keys (BYOK) */}
                  <div className="px-2 border-t border-fd-border/50 pt-4 space-y-3">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-fd-muted-foreground" />
                      <p className="text-[10px] font-medium uppercase tracking-wider text-fd-muted-foreground">
                        API Keys
                      </p>
                    </div>
                    <p className="text-[10px] text-fd-muted-foreground leading-relaxed">
                      Add your own keys to unlock Anthropic and Google models.
                      Stored locally &mdash; never on our servers.
                    </p>
                    <ByokKeyInput
                      provider="Anthropic"
                      storageKey="fixfx-byok-anthropic"
                      placeholder="sk-ant-..."
                      unlocks="Claude models"
                      onKeyChange={refreshByokAndDispatch}
                    />
                    <ByokKeyInput
                      provider="Google"
                      storageKey="fixfx-byok-google"
                      placeholder="AIzaSy..."
                      unlocks="Gemini models"
                      onKeyChange={refreshByokAndDispatch}
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}

        {/* Footer */}
        <div
          className={cn(
            "border-t border-fd-border flex items-center gap-1 p-2 shrink-0",
            isCollapsed ? "flex-col" : "flex-row",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent"
                asChild
              >
                <a
                  href={GITHUB_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "top"}>
              GitHub
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-fd-muted-foreground hover:text-[#5865F2] hover:bg-fd-accent"
                asChild
              >
                <a
                  href={DISCORD_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                >
                  <FaDiscord className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "top"}>
              Discord
            </TooltipContent>
          </Tooltip>
          {!isCollapsed && (
            <span className="text-[10px] text-fd-muted-foreground/50 ml-auto pr-1">
              Chats stay local
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
