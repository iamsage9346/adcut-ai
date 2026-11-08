"""음성 → 단어별 타임스탬프. STT_PROVIDER=whisper|clova"""
from pathlib import Path

from ..config import settings
from .types import Word


def transcribe(video: Path) -> list[Word]:
    if settings.stt_provider == "clova":
        return _clova(video)
    return _whisper(video)


def _whisper(video: Path) -> list[Word]:
    from faster_whisper import WhisperModel

    model = WhisperModel(settings.whisper_model, device="auto", compute_type="auto")
    segments, _ = model.transcribe(str(video), language="ko", word_timestamps=True, vad_filter=True)
    words: list[Word] = []
    for seg in segments:
        for w in seg.words or []:
            words.append(Word(text=w.word.strip(), start=w.start, end=w.end))
    return words


def _clova(video: Path) -> list[Word]:
    # TODO: CLOVA Speech 장문 인식 API 연동 (invoke_url + secret, 단어별 타임스탬프 응답 파싱)
    raise NotImplementedError("CLOVA Speech 연동 예정")
