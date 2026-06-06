"use client";

import { useState } from "react";

import { queryChat } from "@/lib/api";
import type { ChatSource } from "@/lib/types";

type ChatPanelProps = {
  onSourcesChange: (sources: ChatSource[]) => void;
};

export function ChatPanel({ onSourcesChange }: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Retrieved answers and supporting citations will render here once you submit a question."
  );
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleQuery() {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError("Enter a question before querying KnowledgeIQ.");
      return;
    }

    setIsQuerying(true);
    setError(null);

    try {
      const response = await queryChat(trimmedQuestion);
      setAnswer(response.answer);
      onSourcesChange(response.sources);
    } catch (queryError) {
      setError(queryError instanceof Error ? queryError.message : "Query failed.");
      setAnswer("The query could not be completed.");
      onSourcesChange([]);
    } finally {
      setIsQuerying(false);
    }
  }

  return (
    <section className="rounded-panel border border-white/70 bg-white p-7 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
            Chat
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Knowledge Query Console</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
            Ask questions against indexed enterprise documents and review the returned answer
            alongside live citations from the backend retrieval flow.
          </p>
        </div>
        <div className="rounded-2xl border border-steel bg-cloud px-3 py-2 text-xs font-medium text-slate">
          Retrieval Ready
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-3xl border border-steel bg-cloud p-4">
          <label htmlFor="question" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            Question
          </label>
          <textarea
            id="question"
            rows={5}
            placeholder="What does KnowledgeIQ help enterprise teams discover across internal documents?"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
              setError(null);
            }}
            className="mt-3 w-full resize-none border-0 bg-transparent text-sm leading-7 text-ink outline-none placeholder:text-slate"
          />
        </div>

        <div className="rounded-3xl border border-steel bg-[#f9fafb] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            Answer Preview
          </div>
          <p className="mt-3 text-sm leading-7 text-slate">
            {answer}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-steel pt-5">
        <div className="text-sm text-slate">
          {isQuerying ? "Searching indexed document chunks..." : "Query the backend retrieval API."}
        </div>
        <button
          type="button"
          onClick={handleQuery}
          disabled={isQuerying}
          className="rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isQuerying ? "Querying..." : "Ask KnowledgeIQ"}
        </button>
      </div>
    </section>
  );
}
