from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatQueryRequest, ChatQueryResponse
from app.services.embedding_service import MissingOpenAIAPIKeyError
from app.services.retrieval_service import retrieve_sources


router = APIRouter(tags=["chat"])


@router.post("/chat/query", response_model=ChatQueryResponse)
def query_chat(request: ChatQueryRequest) -> ChatQueryResponse:
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    try:
        sources = retrieve_sources(question)
    except MissingOpenAIAPIKeyError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if not sources:
        answer = "No relevant document chunks were found."
    else:
        context = " ".join(source.content for source in sources)
        answer = f"Based on the retrieved documents: {context}"

    return ChatQueryResponse(
        answer=answer,
        sources=sources,
    )
