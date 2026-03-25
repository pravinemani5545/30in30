"use client";

import { FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProcessingProgress } from "./ProcessingProgress";
import type { DocumentSummary } from "@/types/day8";

interface DocumentCardProps {
  document: DocumentSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function statusColor(status: string): string {
  switch (status) {
    case "ready":
      return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    case "failed":
      return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30";
    default:
      return "bg-[#E8A020]/10 text-[#E8A020] border-[#E8A020]/30";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "uploading":
    case "parsing":
    case "chunking":
    case "embedding":
      return "Processing";
    case "ready":
      return "Ready";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export function DocumentCard({
  document,
  isActive,
  onSelect,
  onDelete,
}: DocumentCardProps) {
  const truncatedName =
    document.filename.length > 40
      ? document.filename.slice(0, 37) + "..."
      : document.filename;

  const isProcessing =
    document.status !== "ready" && document.status !== "failed";

  return (
    <div
      onClick={onSelect}
      className={`group relative px-3 py-3 cursor-pointer transition-colors border-l-2 ${
        isActive
          ? "border-l-[#E8A020] bg-[#1A1A1A]"
          : "border-l-transparent hover:bg-[#111111]"
      }`}
    >
      <div className="flex items-start gap-2">
        <FileText className="h-4 w-4 text-[#8A8580] shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#F5F0E8] truncate">{truncatedName}</p>
          <div className="flex items-center gap-2 mt-1">
            {document.page_count && (
              <span className="text-[11px] text-[#555250]">
                {document.page_count} pages
              </span>
            )}
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-4 ${statusColor(document.status)}`}
            >
              {statusLabel(document.status)}
            </Badge>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-[#EF4444] text-[#555250]"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {isProcessing && <ProcessingProgress status={document.status} />}
    </div>
  );
}
