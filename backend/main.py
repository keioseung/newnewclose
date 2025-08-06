from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime

# Mock 데이터 저장소
mock_videos = []
mock_groups = [
    {"id": "1", "name": "가족", "memberCount": 4},
    {"id": "2", "name": "친구들", "memberCount": 6},
    {"id": "3", "name": "팀 프로젝트", "memberCount": 3},
]

app = FastAPI(
    title="CloseTube API",
    description="CloseTube 백엔드 API",
    version="1.0.0"
)

# CORS 설정
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델들
class VideoCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    url: str
    group: str
    privacy: dict

class VideoResponse(BaseModel):
    id: str
    title: str
    description: str
    url: str
    thumbnail: str
    duration: str
    author: str
    views: int
    likes: int
    comments: int
    createdAt: str
    group: str
    privacy: dict

class UrlParseRequest(BaseModel):
    url: str

class UrlParseResponse(BaseModel):
    title: str
    description: Optional[str]
    thumbnail: str
    duration: str
    author: str

# 간단한 URL 파싱 함수 (yt-dlp 없이)
def parse_video_url(url: str) -> dict:
    """간단한 URL 파싱 (yt-dlp 없이)"""
    
    if "youtube.com" in url or "youtu.be" in url:
        return {
            "title": "YouTube Video",
            "description": "YouTube에서 가져온 영상입니다.",
            "thumbnail": "https://via.placeholder.com/320x180/ff0000/ffffff?text=YouTube",
            "duration": "5:30",
            "author": "YouTube User"
        }
    elif "instagram.com" in url:
        return {
            "title": "Instagram Post",
            "description": "Instagram에서 가져온 포스트입니다.",
            "thumbnail": "https://via.placeholder.com/320x180/e4405f/ffffff?text=Instagram",
            "duration": "0:30",
            "author": "Instagram User"
        }
    elif "tiktok.com" in url:
        return {
            "title": "TikTok Video",
            "description": "TikTok에서 가져온 영상입니다.",
            "thumbnail": "https://via.placeholder.com/320x180/000000/ffffff?text=TikTok",
            "duration": "1:00",
            "author": "TikTok User"
        }
    else:
        return {
            "title": "Unknown Video",
            "description": "알 수 없는 영상입니다.",
            "thumbnail": "https://via.placeholder.com/320x180/666666/ffffff?text=Video",
            "duration": "3:00",
            "author": "Unknown Author"
        }

# API 엔드포인트들
@app.get("/")
async def root():
    return {"message": "CloseTube API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/parse-url", response_model=UrlParseResponse)
async def parse_url(request: UrlParseRequest):
    """URL에서 비디오 정보를 파싱합니다."""
    try:
        video_info = parse_video_url(request.url)
        return UrlParseResponse(**video_info)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"URL 파싱 실패: {str(e)}")

@app.get("/videos", response_model=List[VideoResponse])
async def get_videos():
    """모든 비디오를 가져옵니다."""
    # Mock 데이터 반환
    mock_data = [
        {
            "id": "1",
            "title": "가족 여행 하이라이트",
            "description": "올해 여름 가족과 함께한 특별한 여행",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnail": "https://via.placeholder.com/320x180/3b82f6/ffffff?text=가족+여행",
            "duration": "3:24",
            "author": "엄마",
            "views": 12,
            "likes": 8,
            "comments": 3,
            "createdAt": "2일 전",
            "group": "가족",
            "privacy": {"downloadDisabled": True, "externalShareDisabled": True}
        },
        {
            "id": "2",
            "title": "파스타 만들기 클래스",
            "description": "집에서 쉽게 만드는 맛있는 파스타",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnail": "https://via.placeholder.com/320x180/10b981/ffffff?text=요리+클래스",
            "duration": "8:15",
            "author": "친구 민수",
            "views": 5,
            "likes": 12,
            "comments": 7,
            "createdAt": "1주일 전",
            "group": "친구들",
            "privacy": {"downloadDisabled": True, "externalShareDisabled": True}
        }
    ]
    return [VideoResponse(**video) for video in mock_data]

@app.get("/videos/group/{group}", response_model=List[VideoResponse])
async def get_videos_by_group(group: str):
    """특정 그룹의 비디오를 가져옵니다."""
    # Mock 데이터에서 그룹별 필터링
    mock_data = [
        {
            "id": "1",
            "title": "가족 여행 하이라이트",
            "description": "올해 여름 가족과 함께한 특별한 여행",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnail": "https://via.placeholder.com/320x180/3b82f6/ffffff?text=가족+여행",
            "duration": "3:24",
            "author": "엄마",
            "views": 12,
            "likes": 8,
            "comments": 3,
            "createdAt": "2일 전",
            "group": "가족",
            "privacy": {"downloadDisabled": True, "externalShareDisabled": True}
        }
    ]
    filtered_videos = [v for v in mock_data if v["group"] == group]
    return [VideoResponse(**video) for video in filtered_videos]

@app.get("/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str):
    """특정 비디오를 가져옵니다."""
    # Mock 데이터에서 비디오 찾기
    mock_data = [
        {
            "id": "1",
            "title": "가족 여행 하이라이트",
            "description": "올해 여름 가족과 함께한 특별한 여행",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnail": "https://via.placeholder.com/320x180/3b82f6/ffffff?text=가족+여행",
            "duration": "3:24",
            "author": "엄마",
            "views": 12,
            "likes": 8,
            "comments": 3,
            "createdAt": "2일 전",
            "group": "가족",
            "privacy": {"downloadDisabled": True, "externalShareDisabled": True}
        }
    ]
    
    video = next((v for v in mock_data if v["id"] == video_id), None)
    if not video:
        raise HTTPException(status_code=404, detail="비디오를 찾을 수 없습니다")
    
    return VideoResponse(**video)

@app.post("/videos", response_model=VideoResponse)
async def create_video(video: VideoCreate):
    """새 비디오를 생성합니다."""
    # Mock 비디오 생성
    video_data = {
        "id": str(len(mock_videos) + 1),
        "title": video.title,
        "description": video.description,
        "url": video.url,
        "thumbnail": "https://via.placeholder.com/320x180/3b82f6/ffffff?text=새+영상",
        "duration": "5:30",
        "author": "사용자",
        "views": 0,
        "likes": 0,
        "comments": 0,
        "createdAt": datetime.now().isoformat(),
        "group": video.group,
        "privacy": video.privacy
    }
    
    mock_videos.append(video_data)
    return VideoResponse(**video_data)

@app.post("/videos/{video_id}/like")
async def like_video(video_id: str):
    """비디오에 좋아요를 추가합니다."""
    # Mock 좋아요 처리
    return {"message": "좋아요가 추가되었습니다"}

@app.post("/videos/{video_id}/view")
async def increment_views(video_id: str):
    """비디오 조회수를 증가시킵니다."""
    # Mock 조회수 증가
    return {"message": "조회수가 증가되었습니다"}

@app.get("/groups")
async def get_groups():
    """모든 그룹을 가져옵니다."""
    # Mock 그룹 데이터 반환
    return mock_groups

# Railway 배포를 위한 포트 설정
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info") 