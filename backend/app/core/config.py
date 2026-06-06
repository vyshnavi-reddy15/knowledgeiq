from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "KnowledgeIQ API"
    APP_ENV: str = "development"
    API_VERSION: str = "v1"
    USE_MOCK_EMBEDDINGS: bool = False
    OPENAI_API_KEY: str | None = None
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION_NAME: str = "knowledgeiq_documents"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
