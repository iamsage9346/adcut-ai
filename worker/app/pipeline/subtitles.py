"""ASS 자막 생성 (병원 브랜드 템플릿 스타일). 컷 이후 타임라인 기준으로 재계산."""
from pathlib import Path

import pysubs2

from .types import Segment

DEFAULT_STYLE = dict(
    fontname="Pretendard",
    fontsize=64,
    primarycolor=pysubs2.Color(255, 255, 255),
    outlinecolor=pysubs2.Color(20, 20, 20),
    outline=3,
    shadow=0,
    alignment=pysubs2.Alignment.BOTTOM_CENTER,
    marginv=180,
    bold=True,
)


def build_ass(segments: list[Segment], out: Path) -> Path:
    subs = pysubs2.SSAFile()
    subs.info["PlayResX"] = "1080"
    subs.info["PlayResY"] = "1920"
    subs.styles["Default"] = pysubs2.SSAStyle(**DEFAULT_STYLE)

    t = 0.0  # 컷 편집 후 타임라인
    for s in segments:
        dur = s.end - s.start
        subs.append(pysubs2.SSAEvent(start=int(t * 1000), end=int((t + dur) * 1000), text=s.text.replace("\n", r"\N")))
        t += dur
    subs.save(str(out))
    return out
