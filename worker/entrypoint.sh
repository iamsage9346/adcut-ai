#!/bin/sh
set -e
case "${PROCESS_TYPE:-api}" in
  api)
    exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" ;;
  worker)
    exec celery -A app.celery_app worker --loglevel=info --concurrency="${CELERY_CONCURRENCY:-1}" ;;
  *)
    echo "unknown PROCESS_TYPE=$PROCESS_TYPE" >&2; exit 1 ;;
esac
