# KnowledgeIQ API Specification

## API Principles

- RESTful design: Endpoints use predictable resources and actions for MVP workflows.
- JSON responses: API responses return JSON, including success and error payloads.
- Stateless backend: Each request includes the information needed to process it without relying on server-side session state.
- Citation-first answers: Chat responses must include source citations whenever an answer is generated from uploaded documents.
- Clear error handling: Errors should include a stable error code and a human-readable message.

## Error Response Format

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message."
  }
}
```

## 1. POST /documents/upload

### Purpose

Upload PDF, DOCX, or TXT files for ingestion.

### Request

Content type:

```text
multipart/form-data
```

Form fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | `file` | Yes | PDF, DOCX, or TXT document to upload |

### Response

```json
{
  "document_id": "uuid",
  "status": "processing"
}
```

### Error Cases

- `400 invalid_file_type`: File type is not PDF, DOCX, or TXT.
- `400 missing_file`: No file was included in the request.
- `413 file_too_large`: Uploaded file exceeds the configured MVP file size limit.
- `500 upload_failed`: The document could not be stored or queued for ingestion.

## 2. GET /documents

### Purpose

List uploaded documents and their current ingestion status.

### Response Example

```json
{
  "documents": [
    {
      "document_id": "7c3d9d6e-1a2b-4f4f-9a9d-7b4f6c9d1111",
      "filename": "refund_policy.pdf",
      "file_type": "pdf",
      "status": "ready",
      "page_count": 8,
      "created_at": "2026-06-01T10:00:00Z",
      "updated_at": "2026-06-01T10:02:00Z"
    },
    {
      "document_id": "5a2b9c1d-88f2-41b1-b5a1-4c1d2e3f2222",
      "filename": "support_notes.txt",
      "file_type": "txt",
      "status": "processing",
      "page_count": null,
      "created_at": "2026-06-01T10:05:00Z",
      "updated_at": "2026-06-01T10:05:00Z"
    }
  ]
}
```

### Error Cases

- `500 documents_list_failed`: Documents could not be retrieved.

## 3. GET /documents/{document_id}

### Purpose

Get document details and ingestion status for a specific uploaded document.

### Response Example

```json
{
  "document_id": "7c3d9d6e-1a2b-4f4f-9a9d-7b4f6c9d1111",
  "filename": "refund_policy.pdf",
  "file_type": "pdf",
  "status": "ready",
  "page_count": 8,
  "chunk_count": 24,
  "error_message": null,
  "created_at": "2026-06-01T10:00:00Z",
  "updated_at": "2026-06-01T10:02:00Z"
}
```

### Error Cases

- `404 document_not_found`: No document exists for the provided `document_id`.
- `500 document_lookup_failed`: Document details could not be retrieved.

## 4. POST /chat/query

### Purpose

Ask questions against uploaded knowledge and receive citation-backed answers.

### Request

```json
{
  "question": "What is our refund policy?",
  "conversation_id": "optional"
}
```

Request fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `question` | `string` | Yes | User question to answer from uploaded documents |
| `conversation_id` | `string` | No | Existing conversation ID; omitted for a new conversation |

### Response

```json
{
  "answer": "Customers can request a refund within 30 days of purchase if they meet the policy conditions.",
  "conversation_id": "0f6b3957-8d4b-4396-9b51-2d4f3d2a3333",
  "message_id": "9e2c6f11-3450-4cb0-a3d3-7d9a8d4b4444",
  "sources": [
    {
      "document": "refund_policy.pdf",
      "page": 4
    }
  ]
}
```

### Error Cases

- `400 missing_question`: The request did not include a question.
- `400 empty_question`: The question is empty after trimming whitespace.
- `404 conversation_not_found`: The provided `conversation_id` does not exist.
- `409 documents_not_ready`: Uploaded documents are still processing or no ready documents are available.
- `500 retrieval_failed`: Relevant document chunks could not be retrieved.
- `500 answer_generation_failed`: The answer could not be generated.

## 5. POST /feedback

### Purpose

Store answer quality feedback for an assistant message.

### Request

```json
{
  "message_id": "9e2c6f11-3450-4cb0-a3d3-7d9a8d4b4444",
  "rating": "positive"
}
```

Request fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `message_id` | `string` | Yes | Assistant message being rated |
| `rating` | `string` | Yes | Feedback value, such as `positive` or `negative` |
| `comment` | `string` | No | Optional feedback note |

### Response Example

```json
{
  "feedback_id": "29a8d8f2-15c9-4e90-9f5b-0a72b84a5555",
  "message_id": "9e2c6f11-3450-4cb0-a3d3-7d9a8d4b4444",
  "rating": "positive",
  "status": "received"
}
```

### Error Cases

- `400 missing_message_id`: The request did not include a message ID.
- `400 invalid_rating`: Rating is not an accepted value.
- `404 message_not_found`: No assistant message exists for the provided `message_id`.
- `500 feedback_save_failed`: Feedback could not be stored.
