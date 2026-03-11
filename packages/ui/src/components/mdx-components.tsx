"use client";

import * as React from "react";
import { cn } from "@utils/functions/cn";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import {
  CheckCircle2,
  Circle,
  Terminal,
  Copy,
  Check,
  Info,
  Zap,
  Settings,
  Shield,
  Users,
  Server,
  Database,
  Globe,
  LucideIcon,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Wrench,
  Bug,
  Lightbulb,
  FileText,
  HelpCircle,
  ArrowRight,
  Crown,
  ShieldCheck,
  Eye,
  UserCog,
  Lock,
  Unlock,
  Command,
  Keyboard,
  Star,
  Clock,
  ExternalLink,
  ChevronRight,
  Layers,
  Package,
  Gamepad2,
  Car,
  Plane,
  Crosshair,
  MapPin,
  Cloud,
  Mic,
  Video,
  Radio,
} from "lucide-react";

// ============================================================================
// FeatureList - Styled list of features with icons and descriptions
// ============================================================================

interface FeatureItem {
  title: string;
  description?: string;
  icon?: string;
}

interface FeatureListProps {
  features: FeatureItem[];
  columns?: 1 | 2 | 3;
  title?: string;
}

// Icon map for string-based icon lookup (defined early for FeatureList)
const featureIconMap: Record<string, LucideIcon> = {
  info: Info,
  zap: Zap,
  settings: Settings,
  shield: Shield,
  users: Users,
  server: Server,
  database: Database,
  globe: Globe,
  terminal: Terminal,
  check: CheckCircle2,
  checkCircle: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  wrench: Wrench,
  bug: Bug,
  lightbulb: Lightbulb,
  file: FileText,
  help: HelpCircle,
  crown: Crown,
  shieldCheck: ShieldCheck,
  eye: Eye,
  userCog: UserCog,
  user: Users,
  userMinus: Users,
  userPlus: Users,
  lock: Lock,
  unlock: Unlock,
  command: Command,
  keyboard: Keyboard,
  star: Star,
  clock: Clock,
  external: ExternalLink,
  layers: Layers,
  package: Package,
  gamepad: Gamepad2,
  car: Car,
  plane: Plane,
  crosshair: Crosshair,
  mapPin: MapPin,
  cloud: Cloud,
  mic: Mic,
  video: Video,
  radio: Radio,
  arrowUp: ArrowRight,
  arrowRight: ArrowRight,
  edit: FileText,
  refresh: Zap,
  shuffle: Zap,
  play: Zap,
  download: ArrowRight,
  trash: XCircle,
  folder: FileText,
  github: Globe,
  book: FileText,
  hash: Info,
  grid: Layers,
  palette: Zap,
  image: FileText,
};

export function FeatureList({
  features,
  columns = 1,
  title,
}: FeatureListProps) {
  if (!features || !Array.isArray(features)) {
    return null;
  }

  return (
    <div className="my-4">
      {title && (
        <h4 className="mb-3 font-semibold text-fd-foreground">{title}</h4>
      )}
      <div
        className={cn(
          "grid gap-3",
          columns === 2 && "md:grid-cols-2",
          columns === 3 && "md:grid-cols-3",
        )}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon ? featureIconMap[feature.icon] || Zap : Zap;
          return (
            <div
              key={index}
              className="flex gap-3 rounded-lg border border-fd-border bg-fd-card p-3 transition-colors hover:bg-fd-muted/30"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fd-primary/10">
                <Icon className="h-4 w-4 text-fd-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-fd-foreground">
                  {feature.title}
                </p>
                {feature.description && (
                  <p className="mt-0.5 text-sm text-fd-muted-foreground">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// DefinitionList - Key-value pairs with bold terms and descriptions
// ============================================================================

interface DefinitionItem {
  term: string;
  description: string;
}

interface DefinitionListProps {
  items: DefinitionItem[];
  variant?: "default" | "compact" | "bordered";
}

export function DefinitionList({
  items,
  variant = "default",
}: DefinitionListProps) {
  if (variant === "compact") {
    return (
      <div className="my-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex flex-wrap gap-x-2">
            <span className="font-semibold text-fd-foreground">
              {item.term}
            </span>
            <span className="text-fd-muted-foreground">
              — {item.description}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "bordered") {
    return (
      <div className="my-4 divide-y divide-fd-border rounded-lg border border-fd-border">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 p-3 sm:flex-row sm:gap-4"
          >
            <span className="shrink-0 font-semibold text-fd-foreground sm:w-40">
              {item.term}
            </span>
            <span className="text-fd-muted-foreground">{item.description}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <dl className="my-4 space-y-3">
      {items.map((item, index) => (
        <div key={index}>
          <dt className="font-semibold text-fd-foreground">{item.term}</dt>
          <dd className="mt-0.5 text-fd-muted-foreground">
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ============================================================================
// CheckList - List with checkmarks or bullet indicators
// ============================================================================

interface CheckListProps {
  items: string[];
  variant?: "check" | "bullet" | "dash";
  columns?: 1 | 2 | 3;
}

export function CheckList({
  items,
  variant = "check",
  columns = 1,
}: CheckListProps) {
  if (!items || !Array.isArray(items)) {
    return null;
  }

  const Icon = variant === "check" ? CheckCircle2 : Circle;

  return (
    <div
      className={cn(
        "my-4 grid gap-2",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {variant === "dash" ? (
            <span className="mt-1 text-fd-muted-foreground">—</span>
          ) : (
            <Icon
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                variant === "check"
                  ? "text-green-500"
                  : "text-fd-muted-foreground",
              )}
            />
          )}
          <span className="text-fd-muted-foreground">{item}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CommandCard - Display a command with description and copy button
// ============================================================================

interface CommandCardProps {
  command: string;
  description?: string;
  variant?: "default" | "danger" | "warning";
}

export function CommandCard({
  command,
  description,
  variant = "default",
}: CommandCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "my-2 overflow-hidden rounded-lg border",
        variant === "danger" && "border-red-500/30 bg-red-500/5",
        variant === "warning" && "border-amber-500/30 bg-amber-500/5",
        variant === "default" && "border-fd-border bg-fd-card",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Terminal className="h-4 w-4 shrink-0 text-fd-muted-foreground" />
          <code className="truncate font-mono text-sm text-fd-foreground">
            {command}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded p-1 text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      {description && (
        <div className="border-t border-fd-border/50 bg-fd-muted/20 px-3 py-2 text-sm text-fd-muted-foreground">
          {description}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CommandTable - Table of commands with descriptions
// ============================================================================

interface CommandEntry {
  command: string;
  description: string;
  example?: string;
}

interface CommandTableProps {
  commands: CommandEntry[];
  title?: string;
}

export function CommandTable({ commands, title }: CommandTableProps) {
  const [copiedCommand, setCopiedCommand] = React.useState<string | null>(null);

  if (!commands || !Array.isArray(commands)) {
    return null;
  }

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
            <Terminal className="h-4 w-4" />
            {title}
          </h4>
        </div>
      )}
      <div className="divide-y divide-fd-border/50">
        {commands.map((cmd, index) => (
          <div
            key={index}
            className="group p-3 transition-colors hover:bg-fd-muted/20"
          >
            <div className="flex items-start justify-between gap-2">
              <code className="font-mono text-sm text-fd-primary">
                {cmd.command}
              </code>
              <button
                onClick={() => handleCopy(cmd.command)}
                className="shrink-0 rounded p-1 text-fd-muted-foreground opacity-0 transition-all hover:bg-fd-muted hover:text-fd-foreground group-hover:opacity-100"
              >
                {copiedCommand === cmd.command ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              {cmd.description}
            </p>
            {cmd.example && (
              <div className="mt-2 rounded bg-fd-muted/30 px-2 py-1">
                <code className="text-xs text-fd-muted-foreground">
                  {cmd.example}
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PropertyCard - Display a property/setting with value and description
// ============================================================================

interface PropertyCardProps {
  name: string;
  value?: string;
  description: string;
  type?: "info" | "success" | "warning" | "error";
}

export function PropertyCard({
  name,
  value,
  description,
  type = "info",
}: PropertyCardProps) {
  const colors = {
    info: "border-blue-500/30 bg-blue-500/5",
    success: "border-green-500/30 bg-green-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    error: "border-red-500/30 bg-red-500/5",
  };

  return (
    <div className={cn("my-2 rounded-lg border p-3", colors[type])}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-fd-foreground">{name}</span>
        {value && (
          <code className="rounded bg-fd-muted px-1.5 py-0.5 text-xs text-fd-foreground">
            {value}
          </code>
        )}
      </div>
      <p className="mt-1 text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}

// ============================================================================
// IconGrid - Grid of icons with labels (useful for showing available options)
// ============================================================================

const iconMap: Record<string, LucideIcon> = {
  info: Info,
  zap: Zap,
  settings: Settings,
  shield: Shield,
  users: Users,
  user: Users,
  server: Server,
  database: Database,
  globe: Globe,
  terminal: Terminal,
  check: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  wrench: Wrench,
  bug: Bug,
  lightbulb: Lightbulb,
  file: FileText,
  folder: FileText,
  help: HelpCircle,
  crown: Crown,
  shieldCheck: ShieldCheck,
  eye: Eye,
  userCog: UserCog,
  lock: Lock,
  unlock: Unlock,
  command: Command,
  keyboard: Keyboard,
  star: Star,
  clock: Clock,
  external: ExternalLink,
  layers: Layers,
  package: Package,
  gamepad: Gamepad2,
  car: Car,
  plane: Plane,
  crosshair: Crosshair,
  mapPin: MapPin,
  cloud: Cloud,
  mic: Mic,
  video: Video,
  radio: Radio,
  monitor: Info,
  activity: Zap,
  code: Terminal,
  "file-text": FileText,
  hash: Info,
};

interface IconGridItem {
  icon?: keyof typeof iconMap;
  label: string;
  description?: string;
}

interface IconGridProps {
  items: IconGridItem[];
  columns?: 2 | 3 | 4;
}

export function IconGrid({ items, columns = 3 }: IconGridProps) {
  if (!items || !Array.isArray(items)) {
    return null;
  }

  return (
    <div
      className={cn(
        "my-4 grid gap-3",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon ? iconMap[item.icon] || Circle : Circle;
        return (
          <div
            key={index}
            className="flex flex-col items-center gap-2 rounded-lg border border-fd-border bg-fd-card p-3 text-center transition-colors hover:bg-fd-muted/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fd-primary/10">
              <Icon className="h-5 w-5 text-fd-primary" />
            </div>
            <span className="text-sm font-medium text-fd-foreground">
              {item.label}
            </span>
            {item.description && (
              <span className="text-xs text-fd-muted-foreground">
                {item.description}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Shortcut - Display keyboard shortcuts
// ============================================================================

interface ShortcutProps {
  keys: string[];
  description?: string;
}

export function Shortcut({ keys, description }: ShortcutProps) {
  if (!keys || !Array.isArray(keys)) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className="rounded border border-fd-border bg-fd-muted px-1.5 py-0.5 font-mono text-xs text-fd-foreground shadow-sm">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-fd-muted-foreground">+</span>
          )}
        </React.Fragment>
      ))}
      {description && (
        <span className="ml-2 text-sm text-fd-muted-foreground">
          {description}
        </span>
      )}
    </span>
  );
}

// ============================================================================
// StatusBadge - Colored status indicators
// ============================================================================

interface StatusBadgeProps {
  status: "online" | "offline" | "warning" | "info" | "neutral";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const styles = {
    online: "bg-green-500/20 text-green-500 border-green-500/30",
    offline: "bg-red-500/20 text-red-500 border-red-500/30",
    warning: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    info: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    neutral: "bg-fd-muted text-fd-muted-foreground border-fd-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "online" && "bg-green-500",
          status === "offline" && "bg-red-500",
          status === "warning" && "bg-amber-500",
          status === "info" && "bg-blue-500",
          status === "neutral" && "bg-fd-muted-foreground",
        )}
      />
      {children}
    </span>
  );
}

// ============================================================================
// TroubleshootingCard - For troubleshooting documentation
// ============================================================================

interface TroubleshootingCardProps {
  title: string;
  problem?: string;
  symptoms?: string[];
  causes?: string[];
  solutions?: string[];
  solution?: string;
}

export function TroubleshootingCard({
  title,
  problem,
  symptoms,
  causes,
  solutions,
  solution,
}: TroubleshootingCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Support both single solution string and solutions array
  // Handle both literal \n and actual newlines
  const solutionsList =
    solutions ||
    (solution
      ? solution
          .split(/\\n|\n/)
          .map((s) => s.trim())
          .filter((s) => s)
      : []);

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-2 p-4 text-left transition-colors hover:bg-fd-muted/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Bug className="h-4 w-4 text-amber-500" />
          </div>
          <span className="font-semibold text-fd-foreground">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-fd-muted-foreground transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>
      {isExpanded && (
        <div className="border-t border-fd-border p-4 space-y-4">
          {problem && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-fd-foreground mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Problem
              </h4>
              <p className="text-sm text-fd-muted-foreground pl-6">{problem}</p>
            </div>
          )}
          {symptoms && symptoms.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-fd-foreground mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Symptoms
              </h4>
              <ul className="space-y-1 pl-6">
                {symptoms.map((symptom, index) => (
                  <li
                    key={index}
                    className="text-sm text-fd-muted-foreground list-disc"
                  >
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {causes && causes.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-fd-foreground mb-2">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                Possible Causes
              </h4>
              <ul className="space-y-1 pl-6">
                {causes.map((cause, index) => (
                  <li
                    key={index}
                    className="text-sm text-fd-muted-foreground list-disc"
                  >
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {solutionsList.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-fd-foreground mb-2">
                <Lightbulb className="h-4 w-4 text-green-500" />
                Solutions
              </h4>
              <ul className="space-y-1 pl-6">
                {solutionsList.map((sol, index) => (
                  <li
                    key={index}
                    className="text-sm text-fd-muted-foreground list-disc"
                  >
                    {sol}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PermissionTable - For permission documentation (vMenu, etc.)
// ============================================================================

interface PermissionEntry {
  permission: string;
  description: string;
  default?: "allow" | "deny" | "inherit";
}

interface PermissionTableProps {
  permissions: PermissionEntry[];
  title?: string;
}

export function PermissionTable({ permissions, title }: PermissionTableProps) {
  const [copiedPerm, setCopiedPerm] = React.useState<string | null>(null);

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  const handleCopy = (permission: string) => {
    navigator.clipboard.writeText(permission);
    setCopiedPerm(permission);
    setTimeout(() => setCopiedPerm(null), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
            <Shield className="h-4 w-4" />
            {title}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/20">
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Permission
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Description
              </th>
              {permissions.some((p) => p.default) && (
                <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                  Default
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, index) => (
              <tr
                key={index}
                className="group border-b border-fd-border/50 last:border-b-0 hover:bg-fd-muted/20"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-fd-primary">
                      {perm.permission}
                    </code>
                    <button
                      onClick={() => handleCopy(perm.permission)}
                      className="shrink-0 rounded p-1 text-fd-muted-foreground opacity-0 transition-all hover:bg-fd-muted hover:text-fd-foreground group-hover:opacity-100"
                    >
                      {copiedPerm === perm.permission ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-fd-muted-foreground">
                  {perm.description}
                </td>
                {permissions.some((p) => p.default) && (
                  <td className="px-4 py-2.5">
                    {perm.default && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          perm.default === "allow" &&
                            "bg-green-500/20 text-green-500",
                          perm.default === "deny" &&
                            "bg-red-500/20 text-red-500",
                          perm.default === "inherit" &&
                            "bg-fd-muted text-fd-muted-foreground",
                        )}
                      >
                        {perm.default}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// ConfigBlock - For configuration file documentation
// ============================================================================

interface ConfigOption {
  key: string;
  value: string;
  description: string;
  required?: boolean;
}

interface ConfigBlockProps {
  options?: ConfigOption[];
  title?: string;
  language?: string;
  children?: React.ReactNode;
}

export function ConfigBlock({
  options,
  title,
  language = "bash",
  children,
}: ConfigBlockProps) {
  const [copied, setCopied] = React.useState(false);

  // If children are provided, render them directly (for code blocks)
  if (children) {
    return (
      <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
        {title && (
          <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
              <Settings className="h-4 w-4" />
              {title}
            </h4>
          </div>
        )}
        <div className="[&>pre]:my-0 [&>pre]:rounded-none [&>pre]:border-0">
          {children}
        </div>
      </div>
    );
  }

  // Otherwise, use the options array format
  if (!options || options.length === 0) {
    return null;
  }

  const configText = options.map((opt) => `${opt.key} ${opt.value}`).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
            <Settings className="h-4 w-4" />
            {title}
          </h4>
          <button
            onClick={handleCopy}
            className="rounded p-1 text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
      <div className="divide-y divide-fd-border/50">
        {options.map((opt, index) => (
          <div key={index} className="p-3 hover:bg-fd-muted/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="font-mono text-sm text-fd-primary">
                    {opt.key}
                  </code>
                  <code className="font-mono text-sm text-amber-400">
                    {opt.value}
                  </code>
                  {opt.required && (
                    <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-400">
                      required
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-fd-muted-foreground">
                  {opt.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// StepList - Numbered step-by-step instructions
// ============================================================================

// Helper function to parse markdown links in text
function parseMarkdownLinks(text: string): React.ReactNode {
  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fd-primary hover:underline"
      >
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

interface StepAlert {
  type: "info" | "warning" | "success" | "error" | "tip";
  message: string;
}

interface Step {
  title: string;
  description?: string;
  code?: string;
  image?: string;
  imageAlt?: string;
  alert?: StepAlert;
}

interface StepListProps {
  steps: (Step | string)[];
  title?: string;
  imagePosition?: "inline" | "below";
}

// Alert styling config for StepList
const stepAlertConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-500",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-500",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-500",
  },
};

export function StepList({
  steps,
  title,
  imagePosition = "below",
}: StepListProps) {
  if (!steps || !Array.isArray(steps)) {
    return null;
  }

  const normalizedSteps: Step[] = steps.map((step) =>
    typeof step === "string" ? { title: step } : step,
  );

  return (
    <div className="my-4">
      {title && (
        <h4 className="mb-3 font-semibold text-fd-foreground">{title}</h4>
      )}
      <div className="space-y-6">
        {normalizedSteps.map((step, index) => {
          const alertStyle = step.alert
            ? stepAlertConfig[step.alert.type]
            : null;
          const AlertIcon = alertStyle?.icon;

          return (
            <div
              key={index}
              className={cn(
                "flex gap-4",
                imagePosition === "inline" &&
                  step.image &&
                  "flex-col sm:flex-row",
              )}
            >
              <div className="flex gap-4 flex-1">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fd-primary text-sm font-semibold text-fd-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-fd-foreground">{step.title}</p>
                  {step.description && (
                    <p className="mt-1 text-sm text-fd-muted-foreground">
                      {parseMarkdownLinks(step.description)}
                    </p>
                  )}
                  {step.code && (
                    <div className="mt-2 rounded-lg bg-fd-muted/50 p-2">
                      <code className="font-mono text-sm text-fd-foreground">
                        {step.code}
                      </code>
                    </div>
                  )}
                  {step.alert && alertStyle && AlertIcon && (
                    <div
                      className={cn(
                        "mt-3 flex items-start gap-2 rounded-lg border p-3",
                        alertStyle.bg,
                        alertStyle.border,
                      )}
                    >
                      <div className="flex h-5 items-center">
                        <AlertIcon
                          className={cn("h-4 w-4 shrink-0", alertStyle.text)}
                        />
                      </div>
                      <p className="text-sm leading-5 text-fd-foreground">
                        {parseMarkdownLinks(step.alert.message)}
                      </p>
                    </div>
                  )}
                  {step.image &&
                    step.image.trim() !== "" &&
                    imagePosition === "below" && (
                      <div className="mt-3">
                        <ImageZoom
                          src={step.image}
                          alt={step.imageAlt || step.title}
                          width={800}
                          height={450}
                          className="rounded-lg border border-fd-border w-full max-w-lg"
                        />
                      </div>
                    )}
                </div>
              </div>
              {step.image &&
                step.image.trim() !== "" &&
                imagePosition === "inline" && (
                  <div className="sm:w-1/3 shrink-0 ml-12 sm:ml-0">
                    <ImageZoom
                      src={step.image}
                      alt={step.imageAlt || step.title}
                      width={400}
                      height={300}
                      className="rounded-lg border border-fd-border w-full"
                    />
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// ComparisonTable - Compare two options side by side
// ============================================================================

interface ComparisonItem {
  feature: string;
  optionA: string | boolean;
  optionB: string | boolean;
}

interface ComparisonTableProps {
  items: ComparisonItem[];
  headerA: string;
  headerB: string;
  title?: string;
}

export function ComparisonTable({
  items,
  headerA,
  headerB,
  title,
}: ComparisonTableProps) {
  if (!items || !Array.isArray(items)) {
    return null;
  }

  const renderValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      );
    }
    return <span className="text-fd-muted-foreground">{value}</span>;
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="text-sm font-semibold text-fd-foreground">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/20">
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Feature
              </th>
              <th className="px-4 py-2.5 text-center font-medium text-fd-primary">
                {headerA}
              </th>
              <th className="px-4 py-2.5 text-center font-medium text-fd-primary">
                {headerB}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-fd-border/50 last:border-b-0"
              >
                <td className="px-4 py-2.5 font-medium text-fd-foreground">
                  {item.feature}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {renderValue(item.optionA)}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {renderValue(item.optionB)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// QuickLinks - Grid of quick navigation links
// ============================================================================

interface QuickLink {
  title: string;
  description?: string;
  href: string;
  icon?: keyof typeof iconMap;
}

interface QuickLinksProps {
  links: QuickLink[];
  columns?: 2 | 3;
}

export function QuickLinks({ links, columns = 2 }: QuickLinksProps) {
  if (!links || !Array.isArray(links)) {
    return null;
  }

  return (
    <div
      className={cn(
        "my-4 grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
    >
      {links.map((link, index) => {
        const Icon = link.icon ? iconMap[link.icon] || ArrowRight : ArrowRight;
        return (
          <a
            key={index}
            href={link.href}
            className="group flex items-start gap-3 rounded-lg border border-fd-border bg-fd-card p-4 transition-all hover:border-fd-primary/50 hover:bg-fd-muted/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 transition-colors group-hover:bg-fd-primary/20">
              <Icon className="h-5 w-5 text-fd-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-fd-foreground group-hover:text-fd-primary">
                {link.title}
              </p>
              {link.description && (
                <p className="mt-0.5 text-sm text-fd-muted-foreground">
                  {link.description}
                </p>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}

// ============================================================================
// RoleCard - Display role/permission level information
// ============================================================================

interface RoleCardProps {
  title: string;
  description: string;
  permissions: string[];
  type?: "master" | "admin" | "moderator" | "user" | "custom";
  badge?: string;
}

export function RoleCard({
  title,
  description,
  permissions,
  type = "custom",
  badge,
}: RoleCardProps) {
  const typeConfig = {
    master: {
      icon: Crown,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    admin: {
      icon: ShieldCheck,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
    moderator: {
      icon: Shield,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    user: {
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
    },
    custom: {
      icon: UserCog,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-3 overflow-hidden rounded-lg border",
        config.border,
        config.bg,
      )}
    >
      <div className="flex items-center gap-3 border-b border-fd-border/50 px-4 py-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            config.bg,
          )}
        >
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-fd-foreground">{title}</h4>
            {badge && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  config.bg,
                  config.color,
                )}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-fd-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
          Permissions
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(permissions || []).map((perm, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-fd-muted px-2 py-1 font-mono text-xs text-fd-foreground"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PermissionCodeBlock - Display permission syntax with copy functionality
// ============================================================================

interface PermissionCodeBlockProps {
  permissions: {
    permission: string;
    description: string;
  }[];
  title?: string;
  prefix?: string;
}

export function PermissionCodeBlock({
  permissions,
  title,
  prefix = "",
}: PermissionCodeBlockProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  const handleCopy = (permission: string, index: number) => {
    navigator.clipboard.writeText(prefix + permission);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    const allPerms = permissions.map((p) => prefix + p.permission).join("\n");
    navigator.clipboard.writeText(allPerms);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
            <Lock className="h-4 w-4" />
            {title}
          </h4>
          <button
            onClick={copyAll}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
          >
            {copiedIndex === -1 ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            Copy All
          </button>
        </div>
      )}
      <div className="divide-y divide-fd-border/50">
        {permissions.map((perm, index) => (
          <div
            key={index}
            className="group flex items-center justify-between gap-4 px-4 py-2 hover:bg-fd-muted/20"
          >
            <div className="flex-1 min-w-0">
              <code className="font-mono text-sm text-fd-primary">
                {prefix}
                {perm.permission}
              </code>
              <p className="text-xs text-fd-muted-foreground mt-0.5">
                {perm.description}
              </p>
            </div>
            <button
              onClick={() => handleCopy(perm.permission, index)}
              className="shrink-0 rounded p-1 text-fd-muted-foreground opacity-0 transition-all hover:bg-fd-muted hover:text-fd-foreground group-hover:opacity-100"
            >
              {copiedIndex === index ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// KeyboardShortcutTable - Display keyboard shortcuts in a table
// ============================================================================

interface KeyboardShortcut {
  keys: string[];
  action: string;
  description?: string;
}

interface KeyboardShortcutTableProps {
  shortcuts: KeyboardShortcut[];
  title?: string;
}

export function KeyboardShortcutTable({
  shortcuts,
  title,
}: KeyboardShortcutTableProps) {
  if (!shortcuts || !Array.isArray(shortcuts)) {
    return null;
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
            <Keyboard className="h-4 w-4" />
            {title}
          </h4>
        </div>
      )}
      <div className="divide-y divide-fd-border/50">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex items-center gap-1">
              {shortcut.keys.map((key, keyIndex) => (
                <React.Fragment key={keyIndex}>
                  <kbd className="rounded border border-fd-border bg-fd-muted px-2 py-1 font-mono text-xs font-medium text-fd-foreground shadow-sm">
                    {key}
                  </kbd>
                  {keyIndex < shortcut.keys.length - 1 && (
                    <span className="text-fd-muted-foreground">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex-1 text-right">
              <span className="text-sm font-medium text-fd-foreground">
                {shortcut.action}
              </span>
              {shortcut.description && (
                <p className="text-xs text-fd-muted-foreground">
                  {shortcut.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// VersionBadge - Display version compatibility information
// ============================================================================

interface VersionBadgeProps {
  version: string;
  status?: "stable" | "beta" | "alpha" | "deprecated" | "latest";
  releaseDate?: string;
}

export function VersionBadge({
  version,
  status = "stable",
  releaseDate,
}: VersionBadgeProps) {
  const statusConfig = {
    stable: {
      color: "bg-green-500/20 text-green-500 border-green-500/30",
      label: "Stable",
    },
    beta: {
      color: "bg-amber-500/20 text-amber-500 border-amber-500/30",
      label: "Beta",
    },
    alpha: {
      color: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      label: "Alpha",
    },
    deprecated: {
      color: "bg-red-500/20 text-red-500 border-red-500/30",
      label: "Deprecated",
    },
    latest: {
      color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      label: "Latest",
    },
  };

  const config = statusConfig[status];

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
          config.color,
        )}
      >
        <Star className="h-3 w-3" />v{version}
      </span>
      <span
        className={cn("rounded-full border px-2 py-0.5 text-xs", config.color)}
      >
        {config.label}
      </span>
      {releaseDate && (
        <span className="flex items-center gap-1 text-xs text-fd-muted-foreground">
          <Clock className="h-3 w-3" />
          {releaseDate}
        </span>
      )}
    </span>
  );
}

// ============================================================================
// CategoryGrid - Display menu categories with icons (for vMenu/txAdmin)
// ============================================================================

interface CategoryItem {
  name: string;
  description: string;
  icon?: keyof typeof iconMap;
  permission?: string;
  href?: string;
}

interface CategoryGridProps {
  categories: CategoryItem[];
  columns?: 2 | 3 | 4;
  title?: string;
}

export function CategoryGrid({
  categories,
  columns = 3,
  title,
}: CategoryGridProps) {
  if (!categories || !Array.isArray(categories)) {
    return null;
  }

  return (
    <div className="my-4">
      {title && (
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-fd-foreground">
          <Layers className="h-4 w-4" />
          {title}
        </h4>
      )}
      <div
        className={cn(
          "grid gap-3",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {categories.map((category, index) => {
          const Icon = category.icon
            ? iconMap[category.icon] || Package
            : Package;
          const Wrapper = category.href ? "a" : "div";

          return (
            <Wrapper
              key={index}
              href={category.href}
              className={cn(
                "flex flex-col gap-2 rounded-lg border border-fd-border bg-fd-card p-4 transition-colors",
                category.href &&
                  "cursor-pointer hover:border-fd-primary/50 hover:bg-fd-muted/30",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fd-primary/10">
                  <Icon className="h-4 w-4 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-fd-foreground">
                    {category.name}
                  </p>
                  {category.permission && (
                    <code className="text-xs text-fd-muted-foreground">
                      {category.permission}
                    </code>
                  )}
                </div>
                {category.href && (
                  <ChevronRight className="h-4 w-4 text-fd-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-fd-muted-foreground">
                {category.description}
              </p>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// ActionTable - Display actions with permissions in a table format
// ============================================================================

interface ActionItem {
  action: string;
  permission: string;
  description: string;
  dangerous?: boolean;
}

interface ActionTableProps {
  actions: ActionItem[];
  title?: string;
  showDanger?: boolean;
}

export function ActionTable({
  actions,
  title,
  showDanger = true,
}: ActionTableProps) {
  const [copiedPerm, setCopiedPerm] = React.useState<string | null>(null);

  const handleCopy = (permission: string) => {
    navigator.clipboard.writeText(permission);
    setCopiedPerm(permission);
    setTimeout(() => setCopiedPerm(null), 2000);
  };

  if (!actions || !Array.isArray(actions)) {
    return null;
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="text-sm font-semibold text-fd-foreground">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/20">
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Action
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Permission
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {actions.map((item, index) => (
              <tr
                key={index}
                className="group border-b border-fd-border/50 last:border-b-0 hover:bg-fd-muted/20"
              >
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "font-medium",
                      item.dangerous && showDanger
                        ? "text-red-500"
                        : "text-fd-foreground",
                    )}
                  >
                    {item.action}
                    {item.dangerous && showDanger && (
                      <AlertTriangle className="ml-1.5 inline h-3.5 w-3.5" />
                    )}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-fd-primary">
                      {item.permission}
                    </code>
                    <button
                      onClick={() => handleCopy(item.permission)}
                      className="shrink-0 rounded p-1 text-fd-muted-foreground opacity-0 transition-all hover:bg-fd-muted hover:text-fd-foreground group-hover:opacity-100"
                    >
                      {copiedPerm === item.permission ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-fd-muted-foreground">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// InfoBanner - Prominent information banner with icon
// ============================================================================

interface InfoBannerProps {
  type?: "info" | "success" | "warning" | "error" | "tip";
  title: string;
  children: React.ReactNode;
}

export function InfoBanner({
  type = "info",
  title,
  children,
}: InfoBannerProps) {
  const config = {
    info: {
      icon: Info,
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-500",
    },
    success: {
      icon: CheckCircle2,
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-500",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-500",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-500",
    },
    tip: {
      icon: Lightbulb,
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-500",
    },
  };

  const { icon: Icon, bg, border, text } = config[type];

  return (
    <div className={cn("my-4 rounded-lg border p-4", bg, border)}>
      <div className="flex items-start gap-3">
        <div className="flex h-6 items-center">
          <Icon className={cn("h-5 w-5 shrink-0", text)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-semibold leading-6", text)}>{title}</p>
          <div className="mt-1 text-sm text-fd-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FileTree - Display file/folder structure
// ============================================================================

interface FileTreeItem {
  name: string;
  type: "file" | "folder";
  children?: FileTreeItem[];
  description?: string;
}

interface FileTreeProps {
  items: FileTreeItem[];
  title?: string;
}

function FileTreeNode({
  item,
  depth = 0,
}: {
  item: FileTreeItem;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = React.useState(true);
  const isFolder = item.type === "folder";

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1 hover:bg-fd-muted/30 rounded px-2 -mx-2",
          isFolder && "cursor-pointer",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          <>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-fd-muted-foreground transition-transform",
                isOpen && "rotate-90",
              )}
            />
            <Layers className="h-4 w-4 text-amber-500" />
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <FileText className="h-4 w-4 text-fd-muted-foreground" />
          </>
        )}
        <span
          className={cn(
            "text-sm",
            isFolder
              ? "font-medium text-fd-foreground"
              : "text-fd-muted-foreground",
          )}
        >
          {item.name}
        </span>
        {item.description && (
          <span className="text-xs text-fd-muted-foreground ml-2">
            — {item.description}
          </span>
        )}
      </div>
      {isFolder &&
        isOpen &&
        item.children?.map((child, index) => (
          <FileTreeNode key={index} item={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export function FileTree({ items, title }: FileTreeProps) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
            <Layers className="h-4 w-4" />
            {title}
          </h4>
        </div>
      )}
      <div className="p-3 font-mono text-sm">
        {items.map((item, index) => (
          <FileTreeNode key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
