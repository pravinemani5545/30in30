"use client";

import { DocumentCard } from "./DocumentCard";
import { DocumentUploadZone } from "./DocumentUploadZone";
import type { DocumentSummary } from "@/types/day8";

interface DocumentListProps {
  documents: DocumentSummary[];
  activeDocId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export function DocumentList({
  documents,
  activeDocId,
  onSelect,
  onDelete,
  onUpload,
  isUploading,
}: DocumentListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[#262626]">
        <DocumentUploadZone
          onUpload={onUpload}
          isUploading={isUploading}
          compact
        />
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#262626]/50">
        {documents.length === 0 ? (
          <div className="p-6 text-center text-[#555250] text-sm">
            No documents yet
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isActive={doc.id === activeDocId}
              onSelect={() => onSelect(doc.id)}
              onDelete={() => onDelete(doc.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
