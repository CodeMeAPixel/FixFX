"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, Copy, Check, Braces } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { ScrollArea } from "@ui/components/scroll-area";
import { cn } from "@utils/functions/cn";
import { ValidationResult, ValidationIssue, IssueSeverity } from "../types";

interface ResultsPanelProps {
    result: ValidationResult | null;
    onCopyFormatted?: () => void;
}

const SeverityIcon: Record<IssueSeverity, FC<{ className?: string }>> = {
    error: (props) => <XCircle className={cn("h-4 w-4", props.className)} />,
    warning: (props) => <Info className={cn("h-4 w-4", props.className)} />,
    info: (props) => <Info className={cn("h-4 w-4", props.className)} />,
};

const severityColors: Record<IssueSeverity, string> = {
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
};

const issueBgColors: Record<IssueSeverity, string> = {
    error: "border-red-500/30 bg-red-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    info: "border-blue-500/30 bg-blue-500/5",
};

export const ResultsPanel: FC<ResultsPanelProps> = ({ result, onCopyFormatted }) => {
    const [copiedFormatted, setCopiedFormatted] = useState(false);

    const errorCount = result?.issues.filter((i) => i.severity === "error").length ?? 0;
    const warningCount = result?.issues.filter((i) => i.severity === "warning").length ?? 0;
    const infoCount = result?.issues.filter((i) => i.severity === "info").length ?? 0;

    const handleCopy = () => {
        if (result?.formatted) {
            navigator.clipboard.writeText(result.formatted);
            setCopiedFormatted(true);
            setTimeout(() => setCopiedFormatted(false), 2000);
        }
        onCopyFormatted?.();
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 lg:max-w-[50%]">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-fd-border/30 bg-fd-muted/40">
                <div className="flex items-center gap-2.5 text-sm text-fd-foreground/70">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Results</span>
                </div>

                {result && (
                    <div className="flex items-center gap-2">
                        {errorCount > 0 && (
                            <Badge variant="destructive" size="sm">
                                {errorCount} {errorCount === 1 ? "error" : "errors"}
                            </Badge>
                        )}
                        {warningCount > 0 && (
                            <Badge variant="warning" size="sm">
                                {warningCount} {warningCount === 1 ? "warning" : "warnings"}
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

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-5 space-y-5">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="h-20 w-20 rounded-full bg-fd-muted/50 flex items-center justify-center mb-4">
                                    <Braces className="h-10 w-10 text-fd-foreground/30" />
                                </div>
                                <p className="text-sm text-fd-foreground/60 font-medium">
                                    No validation yet
                                </p>
                                <p className="text-xs text-fd-foreground/40 mt-2">
                                    Paste JSON and click Validate to see results
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-5"
                            >
                                {/* Status Alert */}
                                {result.parseError ? (
                                    <Alert className="border-red-500/40 bg-red-500/10 backdrop-blur-sm">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <AlertTitle className="text-red-500 font-semibold">
                                            Parse Error
                                        </AlertTitle>
                                        <AlertDescription className="text-red-400/90 font-mono text-xs mt-2 whitespace-pre-wrap break-all">
                                            {result.parseError}
                                        </AlertDescription>
                                    </Alert>
                                ) : result.valid ? (
                                    <Alert className="border-green-500/40 bg-green-500/10 backdrop-blur-sm">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <AlertTitle className="text-green-500 font-semibold">
                                            Valid JSON
                                        </AlertTitle>
                                        <AlertDescription className="text-green-400/90 text-sm">
                                            {result.issues.length === 0
                                                ? "✨ No issues found. Your JSON looks great!"
                                                : `✓ JSON is valid with ${result.issues.length} suggestion${result.issues.length !== 1 ? "s" : ""}.`}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <Alert className="border-red-500/40 bg-red-500/10 backdrop-blur-sm">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <AlertTitle className="text-red-500 font-semibold">
                                            Validation Failed
                                        </AlertTitle>
                                        <AlertDescription className="text-red-400/90 text-sm">
                                            Found {errorCount} error{errorCount !== 1 ? "s" : ""} that need to be fixed.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Issues List */}
                                {result.issues.length > 0 && (
                                    <Card className="border-fd-border/40 bg-fd-background/50 backdrop-blur-sm">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                                <span>Issues</span>
                                                <Badge variant="secondary" size="sm">
                                                    {result.issues.length}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {result.issues.map((issue, idx) => (
                                                <IssueItem key={idx} issue={issue} index={idx} />
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Formatted Output */}
                                {result.formatted && (
                                    <Card className="border-fd-border/40 bg-fd-background/50 backdrop-blur-sm">
                                        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                                            <CardTitle className="text-sm font-semibold">
                                                Formatted Output
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCopy}
                                                className="h-8 gap-1.5 text-xs"
                                            >
                                                {copiedFormatted ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3.5 w-3.5" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <pre className="text-xs font-mono text-fd-foreground/70 overflow-auto max-h-96 p-4 rounded-lg bg-fd-muted/50 border border-fd-border/30 scrollbar-thin scrollbar-thumb-fd-border/50">
                                                {result.formatted}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Metadata */}
                                {result.metadata && (
                                    <div className="text-xs text-fd-foreground/50 text-center space-y-1">
                                        <p>
                                            {result.metadata.characterCount} chars • {result.metadata.lineCount} lines
                                        </p>
                                        {result.metadata.validationTime && (
                                            <p>Validated in {result.metadata.validationTime.toFixed(2)}ms</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
};

interface IssueItemProps {
    issue: ValidationIssue;
    index: number;
}

const IssueItem: FC<IssueItemProps> = ({ issue, index }) => {
    const Icon = SeverityIcon[issue.severity];

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "flex gap-3 p-3 rounded-lg border transition-colors",
                issueBgColors[issue.severity]
            )}
        >
            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", severityColors[issue.severity])} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge
                        variant={
                            issue.severity === "error"
                                ? "destructive"
                                : issue.severity === "warning"
                                    ? "warning"
                                    : "info"
                        }
                        size="sm"
                        className="capitalize"
                    >
                        {issue.severity}
                    </Badge>
                    <code className="text-xs text-fd-foreground/60 font-mono bg-fd-background/50 px-1.5 py-0.5 rounded">
                        {issue.path}
                    </code>
                    {issue.code && (
                        <span className="text-xs text-fd-foreground/40">{issue.code}</span>
                    )}
                </div>
                <p className="text-sm text-fd-foreground/80 mb-1">{issue.message}</p>
                {issue.suggestion && (
                    <p className="text-xs text-fd-foreground/50 italic">💡 {issue.suggestion}</p>
                )}
            </div>
        </motion.div>
    );
};
