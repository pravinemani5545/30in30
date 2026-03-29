"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColourSwatchProps {
  hex: string;
  role: string;
}

export function ColourSwatch({ hex, role }: ColourSwatchProps) {
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex flex-col items-center gap-1">
            <div
              className="h-8 w-8 rounded-md border"
              style={{
                backgroundColor: hex,
                borderColor: "var(--border)",
              }}
            />
            <span
              className="text-[11px]"
              style={{
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {hex}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{role}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
