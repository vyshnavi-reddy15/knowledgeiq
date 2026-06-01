# KnowledgeIQ Product Requirements Document

## 1. Product Overview

KnowledgeIQ is a citation-backed enterprise RAG platform that allows organizations to upload internal documents and ask questions through an AI interface. The MVP focuses on proving the core knowledge workflow: ingest documents, retrieve relevant content, generate answers, and show source/page citations so users can verify the response.

## 2. Problem Statement

Organizations store critical knowledge across documents that are difficult to search, interpret, and reuse. Employees often spend time manually scanning PDFs, policies, reports, and text files to find reliable answers. Generic AI chat tools can summarize information, but they are not grounded in the organization's uploaded documents and often lack verifiable citations.

KnowledgeIQ addresses this by providing a controlled document question-answering experience where every answer is grounded in uploaded content and supported by source/page references.

## 3. Target Users

- Business teams that need fast answers from internal documents
- Operations teams managing policy, process, and reference material
- Customer support or success teams searching product and process documentation
- Founders, hiring teams, and evaluators reviewing a focused enterprise AI MVP

## 4. MVP Objective

The MVP must prove that a user can upload PDF, DOCX, and TXT documents, ask questions about those documents, and receive conversational answers with source/page citations.

The objective is validation of the end-to-end RAG loop, not enterprise-wide platform completeness.

## 5. In-Scope MVP Features

- Upload PDF, DOCX, and TXT documents
- Parse uploaded documents into usable text
- Chunk parsed document content for retrieval
- Generate embeddings for document chunks
- Store document metadata and processing state in Supabase Postgres
- Store and query vector embeddings in Qdrant
- Retrieve semantically relevant chunks for a user question
- Generate conversational answers grounded in retrieved content
- Display source and page citations with each answer
- Deploy frontend on Vercel
- Deploy backend on Cloud Run

## 6. Out-of-Scope Features

The following features are explicitly deferred and must not be included in the MVP:

- Kubernetes
- Terraform
- RBAC
- Multi-tenancy
- Confluence integration
- SharePoint integration
- Audit logs
- Hybrid search
- Streaming responses

Additional deferred capabilities include advanced admin controls, organization-level policy management, custom connector frameworks, analytics dashboards, and production-grade enterprise governance workflows.

## 7. Core User Flow

1. A user opens KnowledgeIQ.
2. The user uploads one or more PDF, DOCX, or TXT documents.
3. KnowledgeIQ parses the uploaded documents.
4. KnowledgeIQ chunks the parsed content and creates embeddings.
5. The user asks a question in the chat interface.
6. KnowledgeIQ retrieves relevant document chunks using semantic retrieval.
7. KnowledgeIQ generates an answer grounded in the retrieved content.
8. The user receives the answer with source/page citations.
9. The user can inspect citations to verify where the answer came from.

## 8. Success Criteria

- A user can upload a PDF, DOCX, or TXT file without application code changes.
- Uploaded documents are parsed and prepared for semantic retrieval.
- A user can ask natural-language questions about uploaded documents.
- Answers are based on retrieved document content, not unsupported general knowledge.
- Each answer includes source/page citations where applicable.
- The MVP demonstrates a complete retrieval-augmented chat workflow.
- The product remains tightly scoped and avoids deferred enterprise features.

## 9. Non-Functional Requirements

- Clarity: The user interface should make upload, processing status, chat, and citations easy to understand.
- Reliability: Document ingestion and retrieval should fail gracefully with clear error states.
- Traceability: Answers should include citations that allow users to verify the supporting source content.
- Security baseline: Uploaded documents and metadata should be handled as private application data.
- Maintainability: Backend, frontend, and documentation should remain cleanly separated in the repository.
- Deployability: The MVP should be deployable using Vercel for the frontend and Cloud Run for the backend.
- Performance: Typical MVP document uploads and questions should complete within a practical interactive workflow.

## 10. Day 1 Scope Freeze

Day 1 scope is frozen around one proof point: a user can upload PDF, DOCX, and TXT documents, then ask questions and receive answers with source/page citations.

No application code should be generated until the project moves beyond documentation and structure setup. The MVP must stay focused on the core RAG flow and must not expand into Kubernetes, Terraform, RBAC, multi-tenancy, Confluence, SharePoint, audit logs, hybrid search, or streaming.
