"use client";

import { useRef, useState } from "react";

import { uploadDocument } from "@/lib/api";
import type { UploadResponse } from "@/lib/types";

const ACCEPTED_TYPES = ".pdf,.docx,.txt";

export function UploadPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);

  async function handleUpload() {
    if (!selectedFile) {
      setError("Select a PDF, DOCX, or TXT file first.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const response = await uploadDocument(selectedFile);
      setResult(response);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="rounded-panel border border-white/70 bg-white p-7 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
            Upload
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Document Intake</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
            Stage source documents for parsing, chunking, embedding, and citation-backed
            retrieval. Uploads are sent to the FastAPI backend and processed into the vector
            store.
          </p>
        </div>
        <div className="rounded-2xl border border-steel bg-cloud px-3 py-2 text-xs font-medium text-slate">
          Local Upload Queue
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-dashed border-steel bg-cloud px-6 py-10 text-center">
        <div className="mx-auto max-w-md">
          <div className="text-base font-semibold text-ink">Drop PDFs, DOCX, or TXT files here</div>
          <p className="mt-2 text-sm leading-6 text-slate">
            Select a supported file and send it to the backend upload pipeline.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(event) => {
              const nextFile = event.target.files?.[0] || null;
              setSelectedFile(nextFile);
              setError(null);
              setResult(null);
            }}
          />
          {selectedFile ? (
            <p className="mt-4 text-sm font-medium text-ink">{selectedFile.name}</p>
          ) : (
            <p className="mt-4 text-sm text-slate">No file selected</p>
          )}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Select Files
          </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Upload to KnowledgeIQ"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoTile label="Accepted Types" value="PDF, DOCX, TXT" />
        <InfoTile label="Processing" value="Upload to Vector Store" />
        <InfoTile
          label="Status"
          value={result?.status || (isUploading ? "Processing..." : "Awaiting Upload")}
        />
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 rounded-3xl border border-steel bg-cloud p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            Upload Result
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <ResultItem label="Filename" value={result.filename} />
            <ResultItem label="Status" value={result.status} />
            <ResultItem label="Pages" value={String(result.page_count)} />
            <ResultItem label="Chunks Created" value={String(result.chunks_created)} />
            <ResultItem label="Vectors Stored" value={String(result.vectors_stored)} />
            <ResultItem label="Storage Path" value={result.storage_path} />
          </dl>
        </div>
      ) : null}
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-steel bg-cloud px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">{label}</dt>
      <dd className="mt-2 break-all text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
