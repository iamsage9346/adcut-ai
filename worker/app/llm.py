"""LLM 호출 단일 진입점. 공급자를 바꿀 때 이 파일만 고친다."""
from openai import OpenAI

from .config import settings

_client: OpenAI | None = None


def client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def ask(system: str, user: str, *, cheap: bool = False, json: bool = False) -> str:
    model = settings.openai_model_cheap if cheap else settings.openai_model
    kwargs = {"response_format": {"type": "json_object"}} if json else {}
    res = client().chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        **kwargs,
    )
    return res.choices[0].message.content or ""
