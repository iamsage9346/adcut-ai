from dataclasses import dataclass


@dataclass
class Word:
    text: str
    start: float
    end: float


@dataclass
class Segment:
    """대본의 한 문장에 대응하는 영상 구간."""
    text: str          # 자막으로 쓸 대본 원문
    start: float
    end: float
    score: float = 1.0  # 대본 일치도 (베스트 테이크 선택용)
