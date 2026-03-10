"use client";

import * as React from "react";
import { cn } from "@utils/functions/cn";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Sheet, SheetContent, SheetTitle } from "./sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
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
import { NAV_LINKS, DISCORD_LINK, GITHUB_LINK } from "@utils/constants/link";
import {
  History,
  Plus,
  MessagesSquare,
  Settings,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Trash2,
  X,
  Github,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FixFXIcon } from "../icons";
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
  onKeyChange,
}: {
  provider: string;
  storageKey: string;
  placeholder: string;
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
        <span className="text-xs font-medium text-fd-foreground">
          {provider}
        </span>
        {saved && (
          <Badge
            variant="outline"
            className="text-[10px] h-4 px-1.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
          >
            Active
          </Badge>
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
          className="text-xs h-8 pr-16 bg-fd-background border-fd-border focus-visible:ring-[#5865F2]/30"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="h-6 w-6 flex items-center justify-center rounded text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors"
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
              className="h-6 w-6 flex items-center justify-center rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              title="Remove key"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={!key.trim()}
              className="h-6 w-6 flex items-center justify-center rounded text-[#5865F2] hover:bg-[#5865F2]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Save key"
            >
              <Check className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
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

interface MobileChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  temperature: number;
  onModelChange: (model: string) => void;
  onTemperatureChange: (temperature: number) => void;
  onLoadChat: (chat: SavedChat) => void;
  onNewChat: () => void;
}

export function MobileChatDrawer({
  isOpen,
  onClose,
  model,
  temperature,
  onModelChange,
  onTemperatureChange,
  onLoadChat,
  onNewChat,
}: MobileChatDrawerProps) {
  const pathname = usePathname();
  const [recentChats, setRecentChats] = useState<SavedChat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [byokKeys, setByokKeys] = useState({ anthropic: false, google: false });

  const refreshByok = () => {
    setByokKeys({
      anthropic: !!localStorage.getItem("fixfx-byok-anthropic"),
      google: !!localStorage.getItem("fixfx-byok-google"),
    });
  };

  useEffect(() => {
    refreshByok();
    window.addEventListener("byokChanged", refreshByok);
    return () => window.removeEventListener("byokChanged", refreshByok);
  }, []);

  useEffect(() => {
    const currentChatId = localStorage.getItem("fixfx-current-chat");
    if (currentChatId) setActiveChat(currentChatId);
  }, []);

  useEffect(() => {
    const loadChats = () => {
      try {
        const savedChatsStr = localStorage.getItem("fixfx-chats");
        if (savedChatsStr) {
          const savedChats: SavedChat[] = JSON.parse(savedChatsStr);
          setRecentChats(savedChats);
        }
      } catch {
        // ignore parse errors
      }
    };

    if (isOpen) loadChats();

    const handleChatsUpdated = () => {
      if (isOpen) loadChats();
    };
    window.addEventListener("chatsUpdated", handleChatsUpdated);
    window.addEventListener("activeChatChanged", handleChatsUpdated);
    return () => {
      window.removeEventListener("chatsUpdated", handleChatsUpdated);
      window.removeEventListener("activeChatChanged", handleChatsUpdated);
    };
  }, [isOpen]);

  const handleChatClick = (chat: SavedChat) => {
    localStorage.setItem("fixfx-current-chat", chat.id);
    setActiveChat(chat.id);
    onLoadChat(chat);
    onClose();
  };

  const handleNewChat = () => {
    localStorage.removeItem("fixfx-current-chat");
    setActiveChat(null);
    onNewChat();
    onClose();
  };

  const openAIModels = MODELS.filter((m) => m.group === "OpenAI");
  const anthropicModels = MODELS.filter((m) => m.group === "Anthropic");
  const googleModels = MODELS.filter((m) => m.group === "Google");

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-80 sm:w-80 p-0 bg-fd-background border-r border-fd-border flex flex-col"
      >
        <SheetTitle className="sr-only">Fixie AI Navigation</SheetTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-fd-border shrink-0">
          <div className="flex items-center gap-2">
            <FixFXIcon className="h-5 w-5 text-[#5865F2]" />
            <span className="text-sm font-semibold text-fd-foreground">
              Fixie AI
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-md text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 py-2 shrink-0">
          <Button
            size="sm"
            className="w-full h-8 gap-2 text-xs bg-[#5865F2] hover:bg-[#5865F2]/90 text-white"
            onClick={handleNewChat}
          >
            <Plus className="h-3.5 w-3.5" />
            New Chat
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="chats" className="flex-1 flex flex-col min-h-0">
          <div className="px-3 shrink-0">
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
              <div className="px-3 pb-4 space-y-4">
                {/* Navigation */}
                <div className="space-y-0.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-fd-muted-foreground px-1 pb-1">
                    Navigation
                  </p>
                  {NAV_LINKS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.href}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-full justify-start gap-2 text-xs font-normal",
                          isActive
                            ? "bg-[#5865F2]/10 text-[#5865F2]"
                            : "text-fd-foreground hover:bg-fd-accent",
                        )}
                        asChild
                        onClick={onClose}
                      >
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {item.name}
                          </a>
                        ) : (
                          <Link href={item.href}>
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {item.name}
                          </Link>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Recent Chats */}
                <div className="space-y-0.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-fd-muted-foreground px-1 pb-1">
                    Recent Chats
                  </p>
                  {recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                      <Button
                        key={chat.id}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-full justify-start gap-2 text-xs font-normal",
                          activeChat === chat.id
                            ? "bg-[#5865F2]/10 text-[#5865F2]"
                            : "text-fd-foreground hover:bg-fd-accent",
                        )}
                        onClick={() => handleChatClick(chat)}
                      >
                        <History className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </Button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-6 text-fd-muted-foreground">
                      <MessagesSquare className="h-6 w-6 opacity-40" />
                      <span className="text-xs">No recent chats</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 mt-0 min-h-0">
            <ScrollArea className="h-full">
              <div className="px-3 pb-4 space-y-5">
                {/* Model Select */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-fd-foreground">Model</Label>
                  <Select value={model} onValueChange={onModelChange}>
                    <SelectTrigger className="h-8 text-xs bg-fd-background border-fd-border focus:ring-[#5865F2]/30">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase tracking-wider text-fd-muted-foreground">
                          OpenAI
                        </SelectLabel>
                        {openAIModels.map((m) => (
                          <SelectItem
                            key={m.value}
                            value={m.value}
                            className="text-xs"
                          >
                            <span className="flex items-center gap-2">
                              {m.label}
                              {m.isNew && (
                                <Badge className="text-[9px] h-3.5 px-1 bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20">
                                  New
                                </Badge>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase tracking-wider text-fd-muted-foreground">
                          Anthropic
                        </SelectLabel>
                        {anthropicModels.map((m) => (
                          <SelectItem
                            key={m.value}
                            value={m.value}
                            disabled={!byokKeys.anthropic}
                            className="text-xs"
                          >
                            <span className="flex items-center gap-2">
                              {m.label}
                              {m.isNew && (
                                <Badge className="text-[9px] h-3.5 px-1 bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20">
                                  New
                                </Badge>
                              )}
                              {!byokKeys.anthropic && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] h-3.5 px-1"
                                >
                                  Key required
                                </Badge>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase tracking-wider text-fd-muted-foreground">
                          Google
                        </SelectLabel>
                        {googleModels.map((m) => (
                          <SelectItem
                            key={m.value}
                            value={m.value}
                            disabled={!byokKeys.google}
                            className="text-xs"
                          >
                            <span className="flex items-center gap-2">
                              {m.label}
                              {m.isNew && (
                                <Badge className="text-[9px] h-3.5 px-1 bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20">
                                  New
                                </Badge>
                              )}
                              {!byokKeys.google && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] h-3.5 px-1"
                                >
                                  Key required
                                </Badge>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-fd-foreground">
                      Temperature
                    </Label>
                    <span className="text-[10px] font-medium text-[#5865F2] tabular-nums">
                      {temperature.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={([value]) => onTemperatureChange(value)}
                    className="[&_[role=slider]]:h-3.5 [&_[role=slider]]:w-3.5"
                  />
                  <div className="flex justify-between text-[10px] text-fd-muted-foreground">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* API Keys (BYOK) */}
                <div className="space-y-3 border-t border-fd-border/50 pt-4">
                  <div className="flex items-center gap-1.5 px-1">
                    <KeyRound className="h-3.5 w-3.5 text-fd-muted-foreground" />
                    <p className="text-[10px] font-medium uppercase tracking-wider text-fd-muted-foreground">
                      API Keys
                    </p>
                  </div>
                  <ByokKeyInput
                    provider="Anthropic"
                    storageKey="fixfx-byok-anthropic"
                    placeholder="sk-ant-..."
                    onKeyChange={() => {
                      refreshByok();
                      window.dispatchEvent(new CustomEvent("byokChanged"));
                    }}
                  />
                  <ByokKeyInput
                    provider="Google"
                    storageKey="fixfx-byok-google"
                    placeholder="AIzaSy..."
                    onKeyChange={() => {
                      refreshByok();
                      window.dispatchEvent(new CustomEvent("byokChanged"));
                    }}
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-fd-border shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-1 gap-2 text-xs text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent"
            asChild
          >
            <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-1 gap-2 text-xs text-fd-muted-foreground hover:text-[#5865F2] hover:bg-[#5865F2]/10"
            asChild
          >
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">
              <FaDiscord className="h-3.5 w-3.5" />
              Discord
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
