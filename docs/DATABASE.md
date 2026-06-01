# KnowledgeIQ Database Design

## Overview

KnowledgeIQ uses Supabase Postgres for MVP application metadata, document processing state, conversations, messages, and user feedback. Vector embeddings are not stored in Postgres for the MVP.

Qdrant stores vector embeddings and references back to document chunks. Supabase Postgres remains the system of record for relational metadata and chat history.

## MVP Tables

The MVP schema includes five tables:

- `documents`
- `chunks`
- `conversations`
- `messages`
- `feedback`

## 1. documents

### Purpose

Stores metadata and processing state for uploaded PDF, DOCX, and TXT documents.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `filename` | `text` | Original uploaded filename |
| `file_type` | `text` | File type, such as `pdf`, `docx`, or `txt` |
| `storage_path` | `text` | Location of the uploaded file in storage |
| `status` | `text` | Processing state, such as `uploaded`, `processing`, `ready`, or `failed` |
| `page_count` | `integer` | Number of pages when available |
| `error_message` | `text` | Optional processing error details |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

### Relationships

- One `documents` record can have many `chunks` records.
- `chunks.document_id` references `documents.id`.

## 2. chunks

### Purpose

Stores searchable text chunks and metadata extracted from uploaded documents. The vector embedding for each chunk is stored in Qdrant, not in Supabase Postgres.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `document_id` | `uuid` | Foreign key to `documents.id` |
| `chunk_index` | `integer` | Position of the chunk within the document |
| `content` | `text` | Extracted chunk text |
| `page_number` | `integer` | Source page number when available |
| `token_count` | `integer` | Approximate token count when available |
| `qdrant_point_id` | `text` | Reference to the matching vector record in Qdrant |
| `created_at` | `timestamptz` | Creation timestamp |

### Relationships

- Each `chunks` record belongs to one `documents` record.
- Qdrant stores the vector embedding and should include references such as `chunk_id`, `document_id`, and `page_number`.
- `messages.citations` can reference chunk and document metadata for source/page citation display.

## 3. conversations

### Purpose

Stores chat sessions created when a user asks questions about uploaded documents.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `title` | `text` | Optional display title for the conversation |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last activity timestamp |

### Relationships

- One `conversations` record can have many `messages` records.
- `messages.conversation_id` references `conversations.id`.

## 4. messages

### Purpose

Stores user questions and assistant answers within a conversation.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `conversation_id` | `uuid` | Foreign key to `conversations.id` |
| `role` | `text` | Message role, such as `user` or `assistant` |
| `content` | `text` | Message text |
| `citations` | `jsonb` | Citation metadata for assistant answers |
| `created_at` | `timestamptz` | Creation timestamp |

### Relationships

- Each `messages` record belongs to one `conversations` record.
- Assistant messages can include citations that reference `documents` and `chunks`.
- One assistant `messages` record can have one or more `feedback` records.

## 5. feedback

### Purpose

Stores lightweight feedback on assistant responses so the MVP can capture answer quality signals.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `message_id` | `uuid` | Foreign key to `messages.id` |
| `rating` | `text` | Feedback value, such as `positive` or `negative` |
| `comment` | `text` | Optional user feedback comment |
| `created_at` | `timestamptz` | Creation timestamp |

### Relationships

- Each `feedback` record belongs to one assistant `messages` record.
- `feedback.message_id` references `messages.id`.

## Qdrant Responsibility

Qdrant stores vector embeddings for document chunks. Each Qdrant point should include enough payload metadata to connect retrieval results back to Supabase Postgres records, such as:

- `chunk_id`
- `document_id`
- `page_number`
- `chunk_index`

This keeps semantic retrieval fast while preserving Supabase Postgres as the relational metadata store.

## Deferred Database Scope

The MVP database design does not include:

- RBAC
- Multi-tenancy
- Audit logs
- Organizations
- Teams
- Permissions

These capabilities are intentionally deferred until after the MVP proves the core workflow: upload PDF, DOCX, and TXT documents, ask questions, and receive answers with source/page citations.
