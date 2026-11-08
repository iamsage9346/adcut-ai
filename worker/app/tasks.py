"""Celery 작업: 영상 + 대본 → 자동 컷편집 + 자막 렌더링."""
from pathlib import Path

from .celery_app import celery_app
from .pipeline import align, cut, render, stt, subtitles


@celery_app.task(bind=True, name="app.tasks.process_video")
def process_video(self, video_path: str, script_text: str, output_path: str) -> dict:
    src = Path(video_path)
    out = Path(output_path)

    self.update_state(state="PROGRESS", meta={"step": "stt"})
    words = stt.transcribe(src)

    self.update_state(state="PROGRESS", meta={"step": "align"})
    segments = align.match_script(words, script_text)

    self.update_state(state="PROGRESS", meta={"step": "cut"})
    keep = cut.decide_cuts(segments)

    self.update_state(state="PROGRESS", meta={"step": "subtitles"})
    ass_path = out.with_suffix(".ass")
    subtitles.build_ass(keep, ass_path)

    self.update_state(state="PROGRESS", meta={"step": "render"})
    render.render(src, keep, ass_path, out)

    return {"output": str(out), "segments": len(keep)}
