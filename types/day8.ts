export type DocumentStatus =
  | "uploading"
  | "parsing"
  | "chunking"
  | "embedding"
  | "ready"
  | "failed";

export interface PageContent {
  pageNumber: number;
  text: string;
}

export interface Chunk {
  chunkIndex: number;
  pageNumber: number;
  pageStart: number;
  pageEnd: number;
  charStart: number;
  charEnd: number;
  tokenCount: number;
  content: string;
}

export interface RetrievedChunk {
  id: number;
  content: string;
  pageNumber: number;
  pageStart: number;
  pageEnd: number;
  chunkIndex: number;
  similarity: number;
}

export interface RAGContext {
  selectedChunks: RetrievedChunk[];
  contextString: string;
  totalTokensEstimate: number;
  droppedCount: number;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_size_bytes: number | null;
  storage_path: string | null;
  page_count: number | null;
  word_count: number | null;
  title: string | null;
  status: DocumentStatus;
  chunk_count: number;
  error_message: string | null;
  parse_ms: number | null;
  embed_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentSummary {
  id: string;
  filename: string;
  page_count: number | null;
  chunk_count: number;
  status: DocumentStatus;
  created_at: string;
}

export interface Query {
  id: string;
  user_id: string;
  document_id: string;
  question: string;
  answer: string | null;
  sources: RetrievedChunk[] | null;
  no_relevant_content: boolean;
  query_ms: number | null;
  created_at: string;
}

export interface QueryResponse {
  answer: string | null;
  sources: RetrievedChunk[];
  noRelevantContent: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RetrievedChunk[];
  noRelevantContent?: boolean;
  isLoading?: boolean;
}
