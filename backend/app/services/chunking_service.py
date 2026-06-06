from dataclasses import dataclass


CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


@dataclass
class TextChunk:
    content: str
    start_index: int
    end_index: int


def chunk_text(text: str) -> list[TextChunk]:
    cleaned_text = text.strip()
    if not cleaned_text:
        return []

    chunks: list[TextChunk] = []
    start = 0
    step = CHUNK_SIZE - CHUNK_OVERLAP
    text_length = len(cleaned_text)

    while start < text_length:
        end = min(start + CHUNK_SIZE, text_length)
        chunk_content = cleaned_text[start:end].strip()

        if chunk_content:
            chunks.append(
                TextChunk(
                    content=chunk_content,
                    start_index=start,
                    end_index=end,
                )
            )

        if end >= text_length:
            break

        start += step

    return chunks
