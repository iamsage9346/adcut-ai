from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    redis_url: str = "redis://localhost:6379/0"
    worker_port: int = 8000

    supabase_url: str = ""
    supabase_service_role_key: str = ""

    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket: str = "adcut-media"
    r2_public_base_url: str = ""

    stt_provider: str = "whisper"  # whisper | clova
    whisper_model: str = "large-v3"
    clova_speech_invoke_url: str = ""
    clova_speech_secret: str = ""

    openai_api_key: str = ""
    openai_model: str = "gpt-5.5"          # 검수, 대본 생성처럼 판단력이 필요한 작업
    openai_model_cheap: str = "gpt-5.4-mini"  # 대본 대조 등 단순 작업

    youtube_api_key: str = ""

    @property
    def r2_endpoint(self) -> str:
        return f"https://{self.r2_account_id}.r2.cloudflarestorage.com"


settings = Settings()
