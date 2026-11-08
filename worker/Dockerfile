FROM python:3.12-slim-bookworm

# ffmpeg(컷·자막 렌더) + libass 폰트 + 한글 폰트
RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg fonts-noto-cjk fontconfig curl \
    && fc-cache -f \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH" PYTHONUNBUFFERED=1

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY . .
RUN chmod +x entrypoint.sh

# PROCESS_TYPE=api | worker  (Railway 서비스마다 환경변수로 지정)
ENV PROCESS_TYPE=api PORT=8000
EXPOSE 8000
CMD ["./entrypoint.sh"]
