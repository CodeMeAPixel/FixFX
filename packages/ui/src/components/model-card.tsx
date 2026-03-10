import React, { ReactElement } from "react";
import { cn } from "@utils/functions/cn";
import { Check } from "lucide-react";

interface ModelCardProps {
  model?: string;
  id?: string;
  name: string;
  description: string;
  icon: ReactElement;
  color: string;
  provider: string;
  isSelected: boolean;
  disabled?: boolean;
  isNew?: boolean;
  keyRequired?: boolean;
  onClick: () => void;
}

export function ModelCard({
  model,
  id,
  name,
  description,
  icon,
  color,
  provider,
  isSelected,
  disabled = false,
  isNew = false,
  keyRequired = false,
  onClick,
}: ModelCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border p-3 transition-all duration-200",
        disabled
          ? "opacity-50 cursor-not-allowed border-fd-border/50"
          : "cursor-pointer hover:shadow-md",
        isSelected
          ? "border-2 bg-fd-background shadow-sm"
          : "border border-fd-border bg-fd-background/50 hover:border-fd-border/80 hover:bg-fd-background",
      )}
      style={{
        borderColor: isSelected ? color : undefined,
      }}
      onClick={() => !disabled && onClick()}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
            style={{ backgroundColor: color + "15" }}
          >
            {React.cloneElement(icon, {
              style: { color },
              className: "h-4 w-4",
            })}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-fd-foreground">
                {name}
              </span>
              <span className="rounded-full bg-fd-muted px-2 py-0.5 text-[10px] font-medium text-fd-muted-foreground">
                {provider}
              </span>
              {isNew && !disabled && (
                <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[10px] font-medium">
                  New
                </span>
              )}
              {disabled && keyRequired && (
                <span className="rounded-full bg-[#5865F2]/10 text-[#5865F2] px-2 py-0.5 text-[10px] font-medium">
                  Key Required
                </span>
              )}
              {disabled && !keyRequired && (
                <span className="rounded-full bg-amber-500/10 text-amber-500 px-2 py-0.5 text-[10px] font-medium">
                  Soon
                </span>
              )}
            </div>
            <p className="text-xs text-fd-muted-foreground mt-0.5 truncate">
              {description}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
            isSelected ? "border-transparent" : "border-fd-border",
          )}
          style={{
            backgroundColor: isSelected ? color : undefined,
          }}
        >
          {isSelected && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
    </div>
  );
}
