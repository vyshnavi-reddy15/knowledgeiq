from qdrant_client import QdrantClient

from app.core.config import settings
from app.schemas.chat import ChatSource
from app.services.embedding_service import generate_embeddings


TOP_K = 3


def retrieve_sources(question: str) -> list[ChatSource]:
    embeddings = generate_embeddings([question])
    if not embeddings:
        return []

    client = QdrantClient(url=settings.QDRANT_URL)
    result = client.query_points(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        query=embeddings[0],
        limit=TOP_K,
        with_payload=True,
    )

    return [
        ChatSource(
            document_id=point.payload["document_id"],
            filename=point.payload["filename"],
            file_type=point.payload["file_type"],
            chunk_index=point.payload["chunk_index"],
            content=point.payload["content"],
            score=point.score,
            storage_path=point.payload["storage_path"],
        )
        for point in result.points
    ]
