from pathlib import Path

from docx import Document
from pypdf import PdfReader


class UnsupportedFileTypeError(Exception):
    pass


def parse_document(file_path: Path) -> tuple[str, int]:
    extension = file_path.suffix.lower()

    if extension == ".txt":
        text = file_path.read_text(encoding="utf-8")
        return text, 1 if text.strip() else 0

    if extension == ".pdf":
        return _parse_pdf(file_path)

    if extension == ".docx":
        return _parse_docx(file_path)

    raise UnsupportedFileTypeError(f"Unsupported file type: {extension}")


def _parse_pdf(file_path: Path) -> tuple[str, int]:
    reader = PdfReader(str(file_path))
    pages: list[str] = []

    for page in reader.pages:
        pages.append(page.extract_text() or "")

    return "\n".join(pages), len(reader.pages)


def _parse_docx(file_path: Path) -> tuple[str, int]:
    document = Document(str(file_path))
    paragraphs = [paragraph.text for paragraph in document.paragraphs]
    text = "\n".join(paragraphs)
    page_count = 1 if text.strip() else 0
    return text, page_count
