-- PDFQueryEngine — Initial Schema
-- Run this in the Supabase SQL Editor AFTER enabling the vector extension:
--   Database → Extensions → vector → Enable

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Document status enum
CREATE TYPE document_status AS ENUM
  ('uploading', 'parsing', 'chunking', 'embedding', 'ready', 'failed');

-- DOCUMENTS table
CREATE TABLE documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename          TEXT NOT NULL,
  file_size_bytes   INTEGER,
  storage_path      TEXT,
  page_count        INTEGER,
  word_count        INTEGER,
  title             TEXT,
  status            document_status NOT NULL DEFAULT 'uploading',
  chunk_count       INTEGER DEFAULT 0,
  error_message     TEXT,
  parse_ms          INTEGER,
  embed_ms          INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DOCUMENT_CHUNKS table — core of the RAG pipeline
CREATE TABLE document_chunks (
  id            BIGSERIAL PRIMARY KEY,
  document_id   UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_index   INTEGER NOT NULL,
  page_number   INTEGER NOT NULL,
  page_start    INTEGER NOT NULL,
  page_end      INTEGER NOT NULL,
  char_start    INTEGER,
  char_end      INTEGER,
  token_count   INTEGER NOT NULL,
  content       TEXT NOT NULL,
  -- NOTE: extensions.vector(1536) — the extensions. prefix is REQUIRED on Supabase
  embedding     extensions.vector(1536),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- QUERIES table — history + analytics
CREATE TABLE queries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id   UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT,
  sources       JSONB,
  no_relevant_content BOOLEAN DEFAULT FALSE,
  query_ms      INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_documents_user ON documents(user_id, created_at DESC);
CREATE INDEX idx_chunks_document ON document_chunks(document_id, chunk_index);
CREATE INDEX idx_chunks_user ON document_chunks(user_id);

-- HNSW vector index for cosine similarity
-- CRITICAL: This index is only used when ORDER BY uses the raw <=> operator.
-- Using ORDER BY similarity DESC or ORDER BY 1-(embedding<=>q) DESC bypasses it.
CREATE INDEX ON document_chunks
  USING hnsw (embedding extensions.vector_cosine_ops);

CREATE INDEX idx_queries_document ON queries(document_id, created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own documents"
  ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own documents"
  ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own documents"
  ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own documents"
  ON documents FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users select own chunks"
  ON document_chunks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own chunks"
  ON document_chunks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own chunks"
  ON document_chunks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users select own queries"
  ON queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own queries"
  ON queries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- match_documents RPC function — canonical retrieval for the series
-- CRITICAL: ORDER BY must use raw <=> operator for HNSW index to be used.
-- The WHERE clause can safely use 1-(embedding<=>q) expressions.
-- Only ORDER BY must use the raw operator. See Architecture.md for details.
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding extensions.vector(1536),
  p_document_id   UUID,
  match_threshold FLOAT,
  match_count     INT
)
RETURNS TABLE (
  id          BIGINT,
  content     TEXT,
  page_number INT,
  page_start  INT,
  page_end    INT,
  chunk_index INT,
  similarity  FLOAT
)
LANGUAGE sql STABLE
SET search_path = public, extensions
AS $$
  SELECT
    id,
    content,
    page_number,
    page_start,
    page_end,
    chunk_index,
    1 - (embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE document_id = p_document_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding    -- RAW OPERATOR — required for HNSW index
  LIMIT match_count;
$$;

-- SUPABASE STORAGE BUCKET (run separately if needed)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('pdf-documents', 'pdf-documents', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users read own PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pdf-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own PDFs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pdf-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Enable Realtime on documents table for processing progress
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
