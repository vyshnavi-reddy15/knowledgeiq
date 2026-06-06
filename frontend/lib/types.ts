export type UploadResponse = {
  document_id: string;
  filename: string;
  file_type: string;
  status: string;
  storage_path: string;
  page_count: number;
  chunks_created: number;
  vectors_stored: number;
};

export type ChatSource = {
  document_id: string;
  filename: string;
  file_type: string;
  chunk_index: number;
  citation_label: string;
  content: string;
  score: number;
  storage_path: string;
};

export type ChatResponse = {
  answer: string;
  sources: ChatSource[];
};
