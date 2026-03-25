"use client";

import { useState, useCallback } from "react";
import { FileSearch, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useDocuments } from "@/hooks/day8/useDocuments";
import { useUploadDocument } from "@/hooks/day8/useUploadDocument";
import { useDocumentRealtime } from "@/hooks/day8/useDocumentRealtime";
import { DocumentList } from "@/components/day8/DocumentList";
import { DocumentUploadZone } from "@/components/day8/DocumentUploadZone";
import { ChatInterface } from "@/components/day8/ChatInterface";
import { Button } from "@/components/ui/button";
import type { DocumentStatus } from "@/types/day8";

export default function DashboardPage() {
  const {
    documents,
    isLoading,
    refresh,
    updateDocument,
    removeDocument,
    addDocument,
  } = useDocuments();

  const { upload, isUploading } = useUploadDocument();
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeDocument = documents.find((d) => d.id === activeDocId) ?? null;

  // Track the most recently uploading document for Realtime
  const [realtimeDocId, setRealtimeDocId] = useState<string | null>(null);

  const handleRealtimeStatus = useCallback(
    (status: DocumentStatus, updates: Record<string, unknown>) => {
      if (realtimeDocId) {
        updateDocument(realtimeDocId, { status, ...updates } as Record<string, unknown> & { status: DocumentStatus });
      }
    },
    [realtimeDocId, updateDocument]
  );

  useDocumentRealtime(realtimeDocId, handleRealtimeStatus);

  async function handleUpload(file: File) {
    // Optimistically add a placeholder
    const tempId = crypto.randomUUID();
    addDocument({
      id: tempId,
      filename: file.name,
      page_count: null,
      chunk_count: 0,
      status: "uploading",
      created_at: new Date().toISOString(),
    });
    setActiveDocId(tempId);

    const doc = await upload(file);
    if (doc) {
      // Replace placeholder with real doc
      removeDocument(tempId);
      addDocument({
        id: doc.id,
        filename: doc.filename,
        page_count: doc.page_count,
        chunk_count: doc.chunk_count,
        status: doc.status,
        created_at: doc.created_at,
      });
      setActiveDocId(doc.id);
      setRealtimeDocId(doc.status !== "ready" ? doc.id : null);
    } else {
      removeDocument(tempId);
      setActiveDocId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document and all its data?")) return;

    const res = await fetch(`/api/day8/documents/${id}`, { method: "DELETE" });
    if (res.ok) {
      removeDocument(id);
      if (activeDocId === id) setActiveDocId(null);
      toast.success("Document deleted");
    } else {
      toast.error("Failed to delete document");
    }
  }

  async function handleSignOut() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/login?redirectTo=/day8/dashboard";
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#E8A020] animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const hasDocuments = documents.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#262626] shrink-0">
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden p-1 text-[#8A8580]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <FileSearch className="h-5 w-5 text-[#E8A020]" />
          <span className="font-serif text-lg text-[#F5F0E8]">
            PDFQueryEngine
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-[#8A8580] hover:text-[#F5F0E8]"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sign out
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left pane — document list */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } lg:block w-full lg:w-80 border-r border-[#262626] bg-[#0A0A0A] shrink-0 overflow-hidden absolute lg:relative z-10 h-[calc(100vh-52px)] lg:h-auto`}
        >
          <DocumentList
            documents={documents}
            activeDocId={activeDocId}
            onSelect={(id) => {
              setActiveDocId(id);
              setMobileMenuOpen(false);
            }}
            onDelete={handleDelete}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        </aside>

        {/* Right pane — chat or upload zone */}
        <main className="flex-1 overflow-hidden">
          {!hasDocuments && !isUploading ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="w-full max-w-md">
                <DocumentUploadZone
                  onUpload={handleUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>
          ) : (
            <ChatInterface document={activeDocument} />
          )}
        </main>
      </div>
    </div>
  );
}
