"""남길 구간 정리: 같은 문장 재촬영 시 마지막/최고 테이크 선택, 앞뒤 여백 추가, 겹침 병합."""
from .types import Segment


def decide_cuts(segments: list[Segment], pad: float = 0.15) -> list[Segment]:
    # 같은 대본 문장이 여러 번 매칭되면 점수가 가장 높은 것만 남긴다
    best_by_text: dict[str, Segment] = {}
    for s in segments:
        if s.text not in best_by_text or s.score > best_by_text[s.text].score:
            best_by_text[s.text] = s
    kept = sorted(best_by_text.values(), key=lambda s: s.start)

    merged: list[Segment] = []
    for s in kept:
        s = Segment(s.text, max(0.0, s.start - pad), s.end + pad, s.score)
        if merged and s.start <= merged[-1].end:
            merged[-1].end = max(merged[-1].end, s.end)
            merged[-1].text += "\n" + s.text
        else:
            merged.append(s)
    return merged
