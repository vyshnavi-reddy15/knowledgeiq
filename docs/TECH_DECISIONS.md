# KnowledgeIQ Technical Decisions

## Embedding Model

### Choice

`text-embedding-3-small`

### Why

- Cost effective
- Strong retrieval quality
- Production ready

## LLM

### Choice

`gpt-4.1-mini`

### Why

- Affordable
- Good RAG performance
- Fast enough for MVP

## Database

### Choice

Supabase Postgres

### Why

- Managed Postgres
- Auth available later
- Easy deployment

## Vector Database

### Choice

Qdrant

### Why

- Purpose-built vector search
- Open source
- Production friendly

## Frontend

### Choice

Next.js

### Why

- React ecosystem
- Vercel deployment
- Good developer experience

## Backend

### Choice

FastAPI

### Why

- Python ecosystem
- AI tooling compatibility
- Async support

## Deployment

### Frontend

Vercel

### Backend

Cloud Run

## Deferred Decisions

The following decisions are intentionally deferred until after the MVP validates the core upload, retrieval, chat, and citation workflow:

- Kubernetes
- Terraform
- RBAC
- Multi-tenancy
- Hybrid search
- Streaming
- Confluence integration
- SharePoint integration
