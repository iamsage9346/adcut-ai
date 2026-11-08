"""인식된 단어열을 대본 문장과 대조해서 남길 구간을 찾는다.

1차: 문장 단위 퍼지 매칭 (difflib). 애매한 구간은 Claude에게 판단을 맡길 수 있다.
"""
import difflib
import re

from .types import Segment, Word

_SENT_SPLIT = re.compile(r"(?<=[.!?。])\s+|\n+")


def split_script(script: str) -> list[str]:
    return [s.strip() for s in _SENT_SPLIT.split(script) if s.strip()]


def _norm(s: str) -> str:
    return re.sub(r"[^\w가-힣]", "", s).lower()


def match_script(
    words: list[Word], script: str, window_pad: int = 3, min_ratio: float = 0.55, lookahead: int = 300
) -> list[Segment]:
    sentences = split_script(script)
    segments: list[Segment] = []
    cursor = 0
    for sent in sentences:
        target = _norm(sent)
        n = max(1, len(sent.split()))
        best: tuple[float, int, int] | None = None
        # 커서 이후 lookahead 단어 안에서 문장 길이 ± pad 윈도우를 훑으며 가장 비슷한 구간 선택
        for i in range(cursor, min(len(words), cursor + lookahead)):
            for j in range(i + max(1, n - window_pad), min(len(words), i + n + window_pad) + 1):
                cand = _norm("".join(w.text for w in words[i:j]))
                ratio = difflib.SequenceMatcher(None, target, cand).ratio()
                if best is None or ratio > best[0]:
                    best = (ratio, i, j)
            if best and best[0] >= 0.98:  # 거의 완전 일치면 더 볼 필요 없음
                break
        if best and best[0] >= min_ratio:
            ratio, i, j = best
            segments.append(Segment(text=sent, start=words[i].start, end=words[j - 1].end, score=ratio))
            cursor = j
    return segments
