"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { FixFXIcon } from "../icons";

interface MobileChatHeaderProps {
  onMenuClick: () => void;
  model: string;
  temperature: number;
}

const modelDisplayNames: Record<string, string> = {
  "gpt-4o": "GPT-4o",
  "gpt-4o-mini": "GPT-4o Mini",
  "gpt-4-turbo": "GPT-4 Turbo",
  "gpt-3.5-turbo": "GPT-3.5",
  "claude-3-5-sonnet": "Claude 3.5",
  "claude-3-haiku": "Claude Haiku",
  "gemini-2.0-flash": "Gemini 2.0",
  "gemini-1.5-flash": "Gemini Flash",
};

export function MobileChatHeader({ onMenuClick, model, temperature }: MobileChatHeaderProps) {
  return (
    <div className="h-12 flex items-center justify-between px-3 border-b bg-fd-background border-fd-border shrink-0 z-50">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <FixFXIcon className="h-4 w-4 text-fd-foreground" />
          <span className="text-sm font-semibold text-fd-foreground">Fixie AI</span>
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">
        {modelDisplayNames[model] || model}
      </Badge>
    </div>
  );
}
