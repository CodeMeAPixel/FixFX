"use client";

import { FC, RefObject } from "react";
import { FileJson } from "lucide-react";
import { cn } from "@utils/functions/cn";

interface EditorPanelProps {
    value: string;
    onChange: (value: string) => void;
    isInvalid?: boolean;
    textareaRef: RefObject<HTMLTextAreaElement>;
}

export const EditorPanel: FC<EditorPanelProps> = ({
    value,
    onChange,
    isInvalid = false,
    textareaRef,
}) => {
    return (
        <div className="flex-1 flex flex-col min-h-0 lg:border-r border-fd-border/30">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-fd-border/30 bg-fd-muted/40">
                <div className="flex items-center gap-2.5 text-sm text-fd-foreground/70">
                    <FileJson className="h-4 w-4" />
                    <span className="font-medium">Input</span>
                </div>
                <span className="text-xs text-fd-foreground/50">Ctrl+Enter to validate</span>
            </div>

            {/* Editor */}
            <div className="flex-1 relative min-h-0 overflow-hidden">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste your JSON here...&#10;&#10;Select a template from the sidebar to get started."
                    spellCheck={false}
                    className={cn(
                        "absolute inset-0 w-full h-full resize-none p-4 font-mono text-sm",
                        "bg-transparent text-fd-foreground placeholder:text-fd-foreground/30",
                        "focus:outline-none focus:ring-0 border-0",
                        "scrollbar-thin scrollbar-thumb-fd-border/50 scrollbar-track-transparent hover:scrollbar-thumb-fd-border/70",
                        isInvalid && "text-red-400/80",
                    )}
                />
            </div>
        </div>
    );
};
