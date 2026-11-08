# adcut AI 로컬 개발 명령 모음
.PHONY: setup dev web worker api redis supabase stop

setup:            ## 의존성 설치
	cd web && pnpm install
	cd worker && uv sync

redis:            ## Redis 띄우기 (Docker 데몬이 꺼져 있으면 brew services start redis)
	docker compose up -d redis || brew services start redis

supabase:         ## 로컬 Supabase (Docker 필요, 첫 실행 시 이미지 다운로드)
	supabase start

web:              ## Next.js 개발 서버 http://localhost:3000
	cd web && pnpm dev

api:              ## FastAPI http://localhost:8000/docs
	cd worker && uv run uvicorn app.main:app --reload --port 8000

worker:           ## Celery 워커
	cd worker && uv run celery -A app.celery_app worker --loglevel=info --concurrency=1

stop:
	docker compose down
	supabase stop
