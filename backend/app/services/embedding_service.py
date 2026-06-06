import hashlib

from openai import OpenAI

from app.core.config import settings


EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_VECTOR_SIZE = 1536


class MissingOpenAIAPIKeyError(Exception):
    pass


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    if settings.USE_MOCK_EMBEDDINGS:
        return [_generate_mock_embedding(text) for text in texts]

    if not settings.OPENAI_API_KEY:
        raise MissingOpenAIAPIKeyError("OPENAI_API_KEY is not set. Configure it before uploading documents.")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
    )
    return [item.embedding for item in response.data]


def _generate_mock_embedding(text: str) -> list[float]:
    values: list[float] = []
    seed_bytes = text.encode("utf-8") or b"mock"
    counter = 0

    while len(values) < EMBEDDING_VECTOR_SIZE:
        digest = hashlib.sha256(seed_bytes + counter.to_bytes(4, "big")).digest()

        for index in range(0, len(digest), 4):
            chunk = digest[index : index + 4]
            number = int.from_bytes(chunk, "big", signed=False)
            scaled_value = (number / 4294967295.0) * 2.0 - 1.0
            values.append(float(scaled_value))

            if len(values) == EMBEDDING_VECTOR_SIZE:
                break

        counter += 1

    return values
