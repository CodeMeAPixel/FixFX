"use client";

import { FC, RefObject } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Braces,
    Bot,
    FileJson,
    ExternalLink,
    ArrowRight,
    HelpCircle,
    X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ui/components/button";
import { ScrollArea } from "@ui/components/scroll-area";
import { Separator } from "@ui/components/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@ui/components/tooltip";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@ui/components/sheet";
import { cn } from "@utils/functions/cn";
import { ValidatorType, ValidatorConfig, ValidatorPlaceholder } from "../types";

interface ValidatorSidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
    validationType: ValidatorType;
    onValidationTypeChange: (type: ValidatorType) => void;
    validatorConfigs: ValidatorConfig[];
    placeholders: Record<ValidatorType, ValidatorPlaceholder[]>;
    onTemplateSelect: (type: ValidatorType) => void;
    textareaRef: RefObject<HTMLTextAreaElement>;
    onPlaceholderInsert: (placeholder: string) => void;
}

const TypeIcon: Record<ValidatorType, FC<{ className?: string }>> = {
    generic: (props) => <Braces {...props} />,
    "txadmin-embed": (props) => <Bot {...props} />,
    "txadmin-config": (props) => <FileJson {...props} />,
};

const RESOURCES = [
    { name: "JSON Spec", url: "https://www.json.org/", Icon: FileJson, external: true },
    { name: "Discohook", url: "https://discohook.org/", Icon: Bot, external: true },
    { name: "txAdmin Docs", url: "/docs/txadmin", Icon: HelpCircle, external: false },
];

export const ValidatorSidebar: FC<ValidatorSidebarProps> = ({
    collapsed,
    onToggleCollapse,
    mobileOpen,
    onMobileOpenChange,
    validationType,
    onValidationTypeChange,
    validatorConfigs,
    placeholders,
    onTemplateSelect,
    textareaRef,
    onPlaceholderInsert,
}) => {
    const currentPlaceholders = placeholders[validationType] || [];
    const hasTemplates = validationType === "txadmin-embed" || validationType === "txadmin-config";

    const sidebarBody = (
        <div className="p-4 space-y-6">
            <div>
                <h3 className="text-xs font-semibold text-fd-foreground/60 uppercase tracking-wider mb-3">
                    Validation Mode
                </h3>
                <div className="space-y-2">
                    {validatorConfigs.map((config) => {
                        const Icon = TypeIcon[config.type];
                        return (
                            <button
                                key={config.type}
                                onClick={() => onValidationTypeChange(config.type)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                                    validationType === config.type
                                        ? "bg-primary/15 text-primary border border-primary/30 font-medium"
                                        : "text-fd-foreground/60 hover:bg-fd-muted/50 hover:text-fd-foreground border border-transparent",
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{config.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <Separator className="bg-fd-border/20" />

            {hasTemplates && (
                <>
                    <div>
                        <h3 className="text-xs font-semibold text-fd-foreground/60 uppercase tracking-wider mb-3">
                            Templates
                        </h3>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2 text-xs"
                            onClick={() => onTemplateSelect(validationType)}
                        >
                            <Braces className="h-3.5 w-3.5 text-primary" />
                            Load {validatorConfigs.find((c) => c.type === validationType)?.label} Example
                        </Button>
                    </div>
                    <Separator className="bg-fd-border/20" />
                </>
            )}

            {currentPlaceholders.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold text-fd-foreground/60 uppercase tracking-wider mb-3">
                        Variables
                    </h3>
                    <div className="space-y-1">
                        {currentPlaceholders.map((p) => (
                            <TooltipProvider key={p.name}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="w-full flex items-center justify-between px-2.5 py-2 rounded text-xs text-fd-foreground/60 hover:bg-fd-muted/50 hover:text-fd-foreground transition-colors group"
                                            onClick={() => onPlaceholderInsert(`{{${p.name}}}`)}
                                        >
                                            <code className="text-primary/80 group-hover:text-primary font-mono">
                                                {"{{"}{p.name}{"}}"}
                                            </code>
                                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                        <p className="text-xs">{p.description}</p>
                                        {p.example && (
                                            <p className="text-xs text-fd-foreground/60 mt-1">Example: {p.example}</p>
                                        )}
                                        <p className="text-xs text-fd-foreground/40 mt-2">Tap to insert at cursor</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </div>
            )}

            <Separator className="bg-fd-border/20" />

            <div>
                <h3 className="text-xs font-semibold text-fd-foreground/60 uppercase tracking-wider mb-3">
                    Resources
                </h3>
                <div className="space-y-2">
                    {RESOURCES.map((resource) => {
                        const { Icon } = resource;
                        return resource.external ? (
                            <a
                                key={resource.name}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2.5 py-2 rounded text-xs text-fd-foreground/60 hover:bg-fd-muted/50 hover:text-fd-foreground transition-colors group"
                            >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{resource.name}</span>
                                <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ) : (
                            <Link
                                key={resource.name}
                                href={resource.url}
                                className="flex items-center gap-2 px-2.5 py-2 rounded text-xs text-fd-foreground/60 hover:bg-fd-muted/50 hover:text-fd-foreground transition-colors group"
                            >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{resource.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sheet */}
            <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
                <SheetContent side="left" className="w-72 p-0 flex flex-col md:hidden bg-fd-background">
                    <SheetHeader className="flex-row items-center justify-between p-4 border-b border-fd-border/30 space-y-0">
                        <SheetTitle asChild>
                            <Link href="/" className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Braces className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-fd-foreground">Validator</span>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1">
                        {sidebarBody}
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "hidden md:flex flex-col h-full bg-fd-background/40 backdrop-blur-sm border-r border-fd-border/30 shadow-lg transition-all duration-300 ease-in-out",
                    collapsed ? "w-20" : "w-72"
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-fd-border/30">
                    {!collapsed && (
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Braces className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-semibold text-fd-foreground">Validator</span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleCollapse}
                        className={cn("h-8 w-8", collapsed && "mx-auto")}
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    {!collapsed ? (
                        sidebarBody
                    ) : (
                        <TooltipProvider>
                            <div className="flex flex-col items-center py-4 space-y-2">
                                {validatorConfigs.map((config) => {
                                    const Icon = TypeIcon[config.type];
                                    return (
                                        <Tooltip key={config.type}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={validationType === config.type ? "default" : "ghost"}
                                                    size="icon"
                                                    className="h-10 w-10"
                                                    onClick={() => onValidationTypeChange(config.type)}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">{config.label}</TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </TooltipProvider>
                    )}
                </ScrollArea>
            </div>
        </>
    );
};