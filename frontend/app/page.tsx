"use client";

import { useState } from "react";

import { ChatPanel } from "@/components/ChatPanel";
import { SourcesPanel } from "@/components/SourcesPanel";
import { UploadPanel } from "@/components/UploadPanel";
import type { ChatSource } from "@/lib/types";

export default function HomePage() {
  const [sources, setSources] = useState<ChatSource[]>([]);

  return (
    <main className="min-h-screen bg-cloud">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
        <section className="rounded-panel border border-white/70 bg-white/85 p-8 shadow-panel backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-signal/20 bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                Enterprise Knowledge Workflow
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                KnowledgeIQ
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate">
                Citation-backed enterprise knowledge intelligence
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate sm:w-auto">
              <div className="rounded-2xl border border-steel bg-cloud px-4 py-3">
                <div className="font-semibold text-ink">Upload</div>
                <div>Document intake workspace</div>
              </div>
              <div className="rounded-2xl border border-steel bg-cloud px-4 py-3">
                <div className="font-semibold text-ink">Chat</div>
                <div>Question-answer console</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_1.25fr]">
          <UploadPanel />
          <ChatPanel onSourcesChange={setSources} />
        </section>

        <section>
          <SourcesPanel sources={sources} />
        </section>
      </div>
    </main>
  );
}
