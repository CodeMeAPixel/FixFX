"use client";

import { FC } from "react";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/components/tooltip";
import { Play, Sparkles, Eraser, Menu, Loader2 } from "lucide-react";
import { ValidatorType } from "../types";

interface ValidatorHeaderProps {
    validationType: ValidatorType;
    onValidate: () => void;
    onFormat: () => void;
    onClear: () => void;
    isValidating: boolean;
    hasInput: boolean;
    typeLabel: string;
    onMobileMenuOpen: () => void;
}

export const ValidatorHeader: FC<ValidatorHeaderProps> = ({
    validationType: _validationType,
    onValidate,
    onFormat,
    onClear,
    isValidating,
    hasInput,
    typeLabel,
    onMobileMenuOpen,
}) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-fd-border/50 bg-fd-background/60 backdrop-blur-sm">
            {/* Left: Mobile menu + Title + Badge */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMobileMenuOpen}
                    className="md:hidden h-8 w-8 shrink-0"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-fd-foreground">JSON Validator</span>
                <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                    {typeLabel}
                </Badge>
            </div>

            {/* Right: Action Buttons */}
            <TooltipProvider>
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onFormat}
                                disabled={!hasInput}
                                className="h-8 w-8"
                                aria-label="Format JSON"
                            >
                                <Sparkles className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Format JSON (Ctrl+Shift+F)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClear}
                                disabled={!hasInput}
                                className="h-8 w-8"
                                aria-label="Clear editor"
                            >
                                <Eraser className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear editor</TooltipContent>
                    </Tooltip>

                    <div className="w-px h-5 bg-fd-border/60 mx-1.5" />

                    <Button
                        size="sm"
                        onClick={onValidate}
                        disabled={!hasInput || isValidating}
                        className="gap-1.5"
                    >
                        {isValidating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        {isValidating ? "Validating..." : "Validate"}
                    </Button>
                </div>
            </TooltipProvider>
        </div>
    );
};
