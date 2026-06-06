from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.schemas.documents import DocumentUploadResponse
from app.services.chunking_service import chunk_text
from app.services.embedding_service import generate_embeddings
from app.services.parser_service import parse_document
from app.services.vector_store_service import store_document_chunks


ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "storage" / "uploads"


class InvalidFileTypeError(Exception):
    pass


async def save_uploaded_file(file: UploadFile) -> DocumentUploadResponse:
    if not file.filename:
        raise InvalidFileTypeError("Filename is required.")

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise InvalidFileTypeError("Invalid file type. Only PDF, DOCX, and TXT are allowed.")

    document_id = str(uuid4())
    safe_filename = Path(file.filename).name
    stored_filename = f"{document_id}_{safe_filename}"

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOADS_DIR / stored_filename

    contents = await file.read()
    file_path.write_bytes(contents)
    await file.close()
    extracted_text, page_count = parse_document(file_path)
    chunks = chunk_text(extracted_text)
    chunk_texts = [chunk.content for chunk in chunks]
    embeddings = generate_embeddings(chunk_texts)
    storage_path = f"storage/uploads/{stored_filename}"
    vectors_stored = store_document_chunks(
        document_id=document_id,
        filename=safe_filename,
        file_type=extension.lstrip("."),
        storage_path=storage_path,
        chunk_texts=chunk_texts,
        embeddings=embeddings,
    )

    return DocumentUploadResponse(
        document_id=document_id,
        filename=safe_filename,
        file_type=extension.lstrip("."),
        status="uploaded",
        storage_path=storage_path,
        page_count=page_count,
        chunks_created=len(chunks),
        vectors_stored=vectors_stored,
    )
