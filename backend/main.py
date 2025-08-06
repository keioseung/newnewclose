from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from datetime import datetime

# 시작 로깅
print("=== CloseTube API Starting ===")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Environment variables: PORT={os.getenv('PORT')}, CORS_ORIGINS={os.getenv('CORS_ORIGINS')}")

app = FastAPI(
    title="CloseTube API",
    description="CloseTube 백엔드 API",
    version="1.0.0"
)

# CORS 설정
origins = os.getenv("CORS_ORIGINS", "*").split(",")
print(f"CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 기본 엔드포인트들
@app.get("/")
async def root():
    print("Root endpoint called")
    return {"message": "CloseTube API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    print("Health check endpoint called")
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/test")
async def test():
    return {"message": "Test endpoint working!"}

# Railway 배포를 위한 포트 설정
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Starting server on port {port}")
    print("=== CloseTube API Ready ===")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info") 