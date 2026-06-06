from pydantic import BaseModel


class ChatQueryRequest(BaseModel):
    question: str


class ChatSource(BaseModel):
    document_id: str
    filename: str
    file_type: str
    chunk_index: int
    content: str
    score: float
    storage_path: str


class ChatQueryResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
