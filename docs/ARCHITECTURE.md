# KnowledgeIQ Architecture

## 1. Architecture Overview

KnowledgeIQ's MVP architecture focuses on the core retrieval-augmented generation loop:

```text
document upload -> ingestion -> semantic retrieval -> LLM answer -> citations
```

The goal is to prove that users can upload PDF, DOCX, and TXT documents, ask questions about them, and receive grounded answers with source/page citations. The architecture intentionally avoids broader enterprise platform concerns until the MVP value is validated.

## 2. System Architecture

```text
User
↓
Frontend
↓
FastAPI Backend
↓
RAG Service
↓
Qdrant
↓
Supabase Postgres
↓
LLM
```

- User: Uploads documents, asks questions, and reviews answers with citations.
- Frontend: Provides the upload interface, chat interface, and citation display.
- FastAPI Backend: Exposes API endpoints for uploads, document processing, chat, and feedback.
- RAG Service: Owns ingestion orchestration, retrieval logic, context assembly, and LLM request preparation.
- Qdrant: Stores vector embeddings and references to the source chunks used for semantic retrieval.
- Supabase Postgres: Stores document metadata, chunk metadata, conversations, messages, and feedback.
- LLM: Generates conversational answers from retrieved context and citation metadata.

## 3. Ingestion Flow

```text
Upload
↓
Parser
↓
Chunker
↓
Embedding Model
↓
Qdrant
```

- Upload: The user uploads a PDF, DOCX, or TXT document through the frontend.
- Parser: The backend extracts text and source metadata from the uploaded file.
- Chunker: Parsed text is split into retrieval-friendly chunks with source/page references.
- Embedding Model: Each chunk is converted into a vector embedding.
- Qdrant: Embeddings are stored with chunk references so they can be retrieved during chat.

## 4. Query Flow

```text
Question
↓
Embedding
↓
Retrieval
↓
Context Assembly
↓
LLM
↓
Answer + Citations
```

- Question: The user asks a natural-language question in the chat interface.
- Embedding: The backend converts the question into a vector embedding.
- Retrieval: Qdrant returns semantically relevant chunks based on vector similarity.
- Context Assembly: The backend prepares retrieved chunks, source metadata, and citation references for the LLM.
- LLM: The model generates an answer grounded in the assembled context.
- Answer + Citations: The frontend displays the answer with source/page citations for verification.

## 5. MVP Architecture Decisions

- Supabase Postgres stores document metadata, chunk metadata, conversations, messages, and feedback.
- Qdrant stores vector embeddings and chunk references.
- The backend owns ingestion, retrieval, context assembly, and LLM calls.
- The frontend only handles upload, chat, and citation display.

## 6. Explicitly Deferred Architecture

The following are not part of the MVP architecture:

- Kubernetes
- Terraform
- RBAC
- Multi-tenancy
- Confluence
- SharePoint
- Audit logs
- Hybrid search
- Streaming
