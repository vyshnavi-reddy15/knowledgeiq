from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.documents import DocumentUploadResponse
from app.services.storage_service import InvalidFileTypeError, save_uploaded_file


router = APIRouter(tags=["documents"])


@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)) -> DocumentUploadResponse:
    try:
        return await save_uploaded_file(file)
    except InvalidFileTypeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
