from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import sys
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import json

# 시작 로깅
print("=== CloseTube API Starting ===")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")

# Supabase 설정
SUPABASE_URL = "https://pwwuaxjzasfxrdgvnlvp.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3d3VheGp6YXNmeHJkZ3ZubHZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQyNzE1NSwiZXhwIjoyMDY5MDAzMTU1fQ.x75cMmgfavTUtdNvokKag2xuQOnpKGoyICVl-n53p_4"

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase 연결 성공")
except Exception as e:
    print(f"❌ Supabase 연결 실패: {e}")
    supabase = None

app = FastAPI(
    title="CloseTube API",
    description="CloseTube 백엔드 API with Supabase",
    version="1.0.0"
)

# CORS 설정
origins = os.getenv("CORS_ORIGINS", "https://newclose-production.up.railway.app").split(",")
print(f"CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델
class VideoCreate(BaseModel):
    title: str
    description: str
    url: str
    thumbnail: str
    duration: str
    author: str
    group: str
    privacy: dict

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    thumbnail: Optional[str] = None
    duration: Optional[str] = None
    author: Optional[str] = None
    group: Optional[str] = None
    privacy: Optional[dict] = None

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

# 비디오 CRUD 엔드포인트들
@app.get("/videos")
async def get_videos():
    """모든 비디오를 가져옵니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        response = supabase.table('videos').select('*').execute()
        videos = response.data
        print(f"✅ {len(videos)}개의 비디오 조회 성공")
        return videos
    except Exception as e:
        print(f"❌ 비디오 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/videos/group/{group}")
async def get_videos_by_group(group: str):
    """특정 그룹의 비디오를 가져옵니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        response = supabase.table('videos').select('*').eq('group_name', group).execute()
        videos = response.data
        print(f"✅ 그룹 '{group}'의 {len(videos)}개 비디오 조회 성공")
        return videos
    except Exception as e:
        print(f"❌ 그룹별 비디오 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/videos/{video_id}")
async def get_video(video_id: str):
    """특정 비디오를 가져옵니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        response = supabase.table('videos').select('*').eq('id', video_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Video not found")
        
        video = response.data[0]
        print(f"✅ 비디오 '{video_id}' 조회 성공")
        return video
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 비디오 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/videos")
async def create_video(video: VideoCreate):
    """새로운 비디오를 생성합니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        video_data = video.dict()
        video_data['created_at'] = datetime.now().isoformat()
        video_data['views'] = 0
        video_data['likes'] = 0
        video_data['comments'] = 0
        # group을 group_name으로 매핑
        video_data['group_name'] = video_data.pop('group', '기본')
        
        response = supabase.table('videos').insert(video_data).execute()
        created_video = response.data[0]
        print(f"✅ 비디오 '{video.title}' 생성 성공")
        return created_video
    except Exception as e:
        print(f"❌ 비디오 생성 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/videos/{video_id}")
async def update_video(video_id: str, video: VideoUpdate):
    """비디오를 업데이트합니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        update_data = {k: v for k, v in video.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase.table('videos').update(update_data).eq('id', video_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Video not found")
        
        updated_video = response.data[0]
        print(f"✅ 비디오 '{video_id}' 업데이트 성공")
        return updated_video
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 비디오 업데이트 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/videos/{video_id}")
async def delete_video(video_id: str):
    """비디오를 삭제합니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        response = supabase.table('videos').delete().eq('id', video_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Video not found")
        
        print(f"✅ 비디오 '{video_id}' 삭제 성공")
        return {"message": "Video deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 비디오 삭제 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/videos/{video_id}/like")
async def like_video(video_id: str):
    """비디오 좋아요를 증가시킵니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        # 현재 비디오 정보 가져오기
        response = supabase.table('videos').select('likes').eq('id', video_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Video not found")
        
        current_likes = response.data[0]['likes']
        new_likes = current_likes + 1
        
        # 좋아요 수 업데이트
        response = supabase.table('videos').update({'likes': new_likes}).eq('id', video_id).execute()
        updated_video = response.data[0]
        print(f"✅ 비디오 '{video_id}' 좋아요 증가: {current_likes} → {new_likes}")
        return updated_video
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 비디오 좋아요 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/videos/{video_id}/view")
async def increment_view(video_id: str):
    """비디오 조회수를 증가시킵니다."""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        # 현재 비디오 정보 가져오기
        response = supabase.table('videos').select('views').eq('id', video_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Video not found")
        
        current_views = response.data[0]['views']
        new_views = current_views + 1
        
        # 조회수 업데이트
        response = supabase.table('videos').update({'views': new_views}).eq('id', video_id).execute()
        updated_video = response.data[0]
        print(f"✅ 비디오 '{video_id}' 조회수 증가: {current_views} → {new_views}")
        return updated_video
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 비디오 조회수 증가 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/videos/parse-url")
async def parse_video_url(url: str = Form(...)):
    """URL에서 비디오 정보를 파싱합니다."""
    try:
        # 간단한 URL 파싱 (실제로는 더 정교한 파싱이 필요)
        if "youtube.com" in url or "youtu.be" in url:
            platform = "YouTube"
        elif "instagram.com" in url:
            platform = "Instagram"
        elif "tiktok.com" in url:
            platform = "TikTok"
        else:
            platform = "Unknown"
        
        # 기본 정보 생성
        video_info = {
            "title": f"{platform} 비디오",
            "description": f"{platform}에서 공유된 비디오입니다.",
            "url": url,
            "thumbnail": "https://via.placeholder.com/320x180/3b82f6/ffffff?text=Video+Thumbnail",
            "duration": "0:00",
            "author": "사용자",
            "group": "기본",
            "privacy": {"downloadDisabled": True, "externalShareDisabled": True}
        }
        
        print(f"✅ URL 파싱 성공: {platform}")
        return video_info
    except Exception as e:
        print(f"❌ URL 파싱 실패: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Railway 배포를 위한 포트 설정
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Starting server on port {port}")
    print("=== CloseTube API Ready ===")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info") 