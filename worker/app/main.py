from celery.result import AsyncResult
from fastapi import FastAPI
from pydantic import BaseModel

from .celery_app import celery_app
from .tasks import process_video

app = FastAPI(title="adcut AI worker", version="0.1.0")


class JobRequest(BaseModel):
    video_path: str
    script_text: str
    output_path: str


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/jobs")
def create_job(req: JobRequest) -> dict:
    task = process_video.delay(req.video_path, req.script_text, req.output_path)
    return {"job_id": task.id}


@app.get("/jobs/{job_id}")
def job_status(job_id: str) -> dict:
    res = AsyncResult(job_id, app=celery_app)
    return {"job_id": job_id, "state": res.state, "info": res.info if res.info else None}
