# adcut AI

병원 숏폼 제작 자동화: 유행 형식 추천 → 병원 맞춤 대본 → 원장 촬영 → 자동 컷편집·자막 → 업로드

## 기술 스택

| 영역 | 선택 |
|---|---|
| 웹 | Next.js 16 (App Router) + TypeScript + Tailwind v4, Vercel 배포 |
| 인증·DB·파일 | Supabase (Auth, Postgres, Storage) |
| API·작업 큐 | FastAPI + Celery + Redis (Python 3.12, uv) |
| GPU 작업 | Modal / RunPod (추후) |
| 저장소 | Cloudflare R2 (S3 호환, 전송 비용 0) |
| 음성인식 | faster-whisper(로컬 시작) → CLOVA Speech / 리턴제로(상용) |
| 컷·자막 | ffmpeg + ASS(libass), pysubs2 |
| AI | OpenAI API (대본 대조, 트렌드 분석, 의료광고법 검수) — `worker/app/llm.py` 한 곳에서 호출 |
| 트렌드 | YouTube Data API v3 |

## 폴더 구조

```
web/        Next.js 프론트 (src/lib/supabase, src/lib/worker.ts)
worker/     FastAPI + Celery 워커
  app/main.py            REST API (/jobs)
  app/tasks.py           process_video 작업
  app/pipeline/          stt → align → cut → subtitles → render
  app/pipeline/compliance.py  의료광고법 검수
  app/trends.py          YouTube 트렌드 수집
supabase/   config.toml, migrations/
docker-compose.yml  Redis
Makefile    로컬 실행 명령
```

## 처음 실행

```bash
# 1. 환경변수
cp web/.env.example web/.env.local
cp worker/.env.example worker/.env
#    → Supabase 키, OPENAI_API_KEY, YOUTUBE_API_KEY 채우기

# 2. 인프라
make redis          # Redis
make supabase       # 로컬 Supabase (anon key / service role key 출력됨)

# 3. 서버 3개 (터미널 각각)
make web            # http://localhost:3000
make api            # http://localhost:8000/docs
make worker         # Celery
```

## 작업 흐름

1. 영상 + 대본 업로드 (`projects` 테이블, Storage/R2)
2. 웹 → `POST /jobs` → Celery `process_video`
3. 워커: Whisper 단어별 타임스탬프 → 대본과 퍼지 매칭 → 재촬영 베스트 테이크 선택 → ASS 자막 → ffmpeg 렌더
4. 결과 미리보기, 자막 텍스트 수정 후 다운로드

## 다음 단계

- [ ] 업로드 UI + Supabase Auth 로그인
- [ ] CLOVA Speech 연동 (`pipeline/stt.py`)
- [ ] LLM으로 애매한 구간 판단 (`pipeline/align.py`)
- [ ] 병원 브랜드 자막 템플릿 (Remotion 검토)
- [ ] 트렌드 수집 크론 + 형식 분석 리포트
