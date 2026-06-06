from uuid import NAMESPACE_DNS, uuid5

from qdrant_client import QdrantClient, models

from app.core.config import settings


VECTOR_SIZE = 1536


def store_document_chunks(
    document_id: str,
    filename: str,
    file_type: str,
    storage_path: str,
    chunk_texts: list[str],
    embeddings: list[list[float]],
) -> int:
    if not chunk_texts or not embeddings:
        return 0

    client = QdrantClient(url=settings.QDRANT_URL)
    _ensure_collection(client)

    points = [
        models.PointStruct(
            id=str(uuid5(NAMESPACE_DNS, f"{document_id}:{index}")),
            vector=embedding,
            payload={
                "document_id": document_id,
                "filename": filename,
                "file_type": file_type,
                "chunk_index": index,
                "content": chunk_text,
                "storage_path": storage_path,
            },
        )
        for index, (chunk_text, embedding) in enumerate(zip(chunk_texts, embeddings))
    ]

    client.upsert(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        points=points,
    )
    return len(points)


def _ensure_collection(client: QdrantClient) -> None:
    if client.collection_exists(settings.QDRANT_COLLECTION_NAME):
        return

    client.create_collection(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        vectors_config=models.VectorParams(
            size=VECTOR_SIZE,
            distance=models.Distance.COSINE,
        ),
    )
