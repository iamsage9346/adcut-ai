from celery import Celery

from .config import settings

celery_app = Celery("adcut", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    worker_prefetch_multiplier=1,  # 영상 작업은 무거우니 한 번에 하나씩
)
celery_app.autodiscover_tasks(["app"])
