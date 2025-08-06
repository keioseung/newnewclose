#!/bin/bash

# 환경변수 출력 (디버깅용)
echo "PORT: $PORT"
echo "CORS_ORIGINS: $CORS_ORIGINS"

# 포트 설정 (Railway는 PORT 환경변수를 제공)
if [ -z "$PORT" ]; then
    export PORT=8000
fi

echo "Starting CloseTube API on port $PORT"

# Python 애플리케이션 실행
exec python main.py 