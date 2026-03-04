"use client";

import { FC, useMemo } from "react";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/components/tooltip";
import { Code2, Play, Sparkles, Eraser } from "lucide-react";
import { ValidatorType } from "../types";

interface ValidatorHeaderProps {
    validationType: ValidatorType;
    onValidate: () => void;
    onFormat: () => void;
    onClear: () => void;
    isValidating: boolean;
    hasInput: boolean;
    typeLabel: string;
}

export const ValidatorHeader: FC<ValidatorHeaderProps> = ({
    validationType,
    onValidate,
    onFormat,
    onClear,
    isValidating,
    hasInput,
    typeLabel,
}) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-fd-border/50 bg-fd-background/60 backdrop-blur-sm">
            {/* Left: Title and Badge */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                    <Code2 className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-semibold text-fd-foreground">JSON Validator</h1>
                </div>
                <Badge variant="secondary" size="sm" className="ml-2">
                    {typeLabel}
                </Badge>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2.5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onFormat}
                                disabled={!hasInput}
                                className="gap-2"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span className="hidden sm:inline text-sm">Format</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Format/prettify JSON (Ctrl+Shift+F)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onClear}
                                disabled={!hasInput}
                                className="gap-2"
                            >
                                <Eraser className="h-4 w-4" />
                                <span className="hidden sm:inline text-sm">Clear</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear editor</TooltipContent>
                    </Tooltip>

                    <Button
                        onClick={onValidate}
                        disabled={!hasInput || isValidating}
                        className="gap-2 bg-primary hover:bg-primary/90 text-white ml-1"
                    >
                        <Play className="h-4 w-4" />
                        {isValidating ? (
                            <>
                                <span className="inline-flex">
                                    <span className="animate-spin">⚙</span>
                                </span>
                                Validating...
                            </>
                        ) : (
                            "Validate"
                        )}
                    </Button>
                </TooltipProvider>
            </div>
        </div>
    );
};
