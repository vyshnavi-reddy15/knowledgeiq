# KnowledgeIQ

KnowledgeIQ is an MVP knowledge assistant for uploading business documents, parsing them into searchable content, and supporting conversational answers grounded in source citations.

## MVP Goal

Build a focused document intelligence workflow that accepts PDF, DOCX, and TXT files, converts them into chunks and embeddings, stores searchable vectors, and enables chat responses with reliable source and page citations.

## Tech Stack

- Frontend hosting: Vercel
- Backend runtime: Cloud Run
- Primary database: Supabase Postgres
- Vector database: Qdrant
- Document ingestion: PDF, DOCX, and TXT parsing
- Retrieval: semantic retrieval over embedded document chunks

## MVP Features

- PDF, DOCX, and TXT upload
- Document parsing
- Text chunking
- Embeddings generation
- Semantic retrieval
- Conversational chat
- Source and page citations
- Supabase Postgres persistence
- Qdrant vector storage
- Vercel frontend deployment
- Cloud Run backend deployment

## Repository Structure

```text
knowledgeiq/
├── backend/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── docs/
└── README.md
```

## Day 1 Status Checklist

- [x] Create initial repository structure
- [x] Add backend placeholder directory
- [x] Add frontend placeholder directory
- [x] Add docs directory
- [x] Document MVP scope
- [ ] Generate backend application code
- [ ] Generate frontend application code

## MVP Scope Freeze

The MVP scope is limited to PDF, DOCX, and TXT upload; document parsing; chunking; embeddings; semantic retrieval; conversational chat; source/page citations; Supabase Postgres; Qdrant; Vercel; and Cloud Run.

The following are explicitly deferred: Kubernetes, Terraform, RBAC, multi-tenancy, Confluence, SharePoint, audit logs, hybrid search, and streaming.
