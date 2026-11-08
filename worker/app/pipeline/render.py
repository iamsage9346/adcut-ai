"""ffmpeg: 구간 잘라 붙이기 + ASS 자막 번인."""
import subprocess
from pathlib import Path

from .types import Segment


def render(src: Path, segments: list[Segment], ass: Path, out: Path) -> Path:
    n = len(segments)
    parts = []
    for i, s in enumerate(segments):
        parts.append(
            f"[0:v]trim=start={s.start:.3f}:end={s.end:.3f},setpts=PTS-STARTPTS[v{i}];"
            f"[0:a]atrim=start={s.start:.3f}:end={s.end:.3f},asetpts=PTS-STARTPTS[a{i}];"
        )
    concat_in = "".join(f"[v{i}][a{i}]" for i in range(n))
    ass_path = str(ass).replace(":", r"\:").replace("'", r"\'")
    filter_complex = (
        "".join(parts)
        + f"{concat_in}concat=n={n}:v=1:a=1[vc][ac];"
        + f"[vc]ass='{ass_path}'[vout]"
    )
    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-filter_complex", filter_complex,
        "-map", "[vout]", "-map", "[ac]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart",
        str(out),
    ]
    subprocess.run(cmd, check=True)
    return out
