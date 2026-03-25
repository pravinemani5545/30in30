"use client";

import { useCallback, useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadZoneProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  compact?: boolean;
}

export function DocumentUploadZone({
  onUpload,
  isUploading,
  compact = false,
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are accepted");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File must be under 10MB");
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  if (compact) {
    return (
      <>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-2 px-3 text-sm text-[#E8A020] hover:bg-[#E8A02010] border border-dashed border-[#262626] hover:border-[#E8A020] rounded-lg transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "+ Upload PDF"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />
      </>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
        isDragging
          ? "border-[#E8A020] bg-[#E8A02008]"
          : "border-[#262626] hover:border-[#E8A020]"
      }`}
    >
      <Upload
        className={`h-10 w-10 mb-4 ${isDragging ? "text-[#E8A020]" : "text-[#555250]"}`}
      />
      <p className="text-[#F5F0E8] text-sm mb-1">
        {isUploading ? "Uploading..." : "Drop a PDF here or click to browse"}
      </p>
      <p className="text-[#555250] text-xs">PDF only, up to 10MB</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
