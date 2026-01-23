# Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps (add build-essential if you compile native wheels)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
  && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip poetry

# Copy dependency files first to leverage docker layer cache
COPY pyproject.toml poetry.lock* /app/

# Install dependencies (no venv inside container)
RUN poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi --only main

# Copy app code
COPY app /app/app

EXPOSE 8000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:8000", "--workers", "2", "--timeout", "60"]
