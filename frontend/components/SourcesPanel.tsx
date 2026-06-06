import type { ChatSource } from "@/lib/types";

type SourcesPanelProps = {
  sources: ChatSource[];
};

export function SourcesPanel({ sources }: SourcesPanelProps) {
  return (
    <section className="rounded-panel border border-white/70 bg-white p-7 shadow-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
            Sources
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Citation Panel</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">
            Retrieved evidence will appear here with chunk-level traceability so users can inspect
            supporting context before trusting an answer.
          </p>
        </div>
        <div className="rounded-2xl border border-steel bg-cloud px-3 py-2 text-xs font-medium text-slate">
          Live Citation Results
        </div>
      </div>

      {sources.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-steel bg-cloud px-6 py-10 text-center">
          <div className="text-base font-semibold text-ink">No sources available yet</div>
          <p className="mt-3 text-sm leading-7 text-slate">
            Upload a document, ask a question, and matching citations will appear here with chunk
            content, score, and storage path.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {sources.map((source) => (
            <article
              key={`${source.document_id}-${source.chunk_index}`}
              className="rounded-3xl border border-steel bg-cloud p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-ink">{source.citation_label}</h3>
                <span className="rounded-full border border-steel px-3 py-1 text-xs font-medium text-slate">
                  {source.score.toFixed(2)}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                {source.filename}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate">{source.content}</p>
              <p className="mt-4 break-all text-xs text-slate">{source.storage_path}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
