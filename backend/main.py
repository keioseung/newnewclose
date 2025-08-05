from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime, timedelta
import re
import requests
from bs4 import BeautifulSoup
import yt_dlp

# Firebase 초기화
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

app = FastAPI(
    title="CloseTube API",
    description="CloseTube 백엔드 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
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

# URL 파싱 함수
def parse_video_url(url: str) -> dict:
    """YouTube, Instagram, TikTok 등의 URL에서 비디오 정보를 추출합니다."""
    
    # YouTube URL 패턴
    youtube_pattern = r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)'
    youtube_match = re.search(youtube_pattern, url)
    
    if youtube_match:
        video_id = youtube_match.group(1)
        try:
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': True,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                return {
                    "title": info.get('title', 'Unknown Title'),
                    "description": info.get('description', ''),
                    "thumbnail": info.get('thumbnail', ''),
                    "duration": str(info.get('duration', 0)),
                    "author": info.get('uploader', 'Unknown Author')
                }
        except Exception as e:
            print(f"Error parsing YouTube URL: {e}")
            return {
                "title": "YouTube Video",
                "description": "",
                "thumbnail": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                "duration": "0",
                "author": "Unknown Author"
            }
    
    # Instagram URL 패턴
    instagram_pattern = r'instagram\.com\/p\/([a-zA-Z0-9_-]+)'
    instagram_match = re.search(instagram_pattern, url)
    
    if instagram_match:
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Instagram 메타데이터 추출
            title = soup.find('meta', property='og:title')
            description = soup.find('meta', property='og:description')
            image = soup.find('meta', property='og:image')
            
            return {
                "title": title.get('content', 'Instagram Post') if title else "Instagram Post",
                "description": description.get('content', '') if description else "",
                "thumbnail": image.get('content', '') if image else "",
                "duration": "0",
                "author": "Instagram User"
            }
        except Exception as e:
            print(f"Error parsing Instagram URL: {e}")
            return {
                "title": "Instagram Post",
                "description": "",
                "thumbnail": "",
                "duration": "0",
                "author": "Instagram User"
            }
    
    # TikTok URL 패턴
    tiktok_pattern = r'tiktok\.com\/@[^\/]+\/video\/(\d+)'
    tiktok_match = re.search(tiktok_pattern, url)
    
    if tiktok_match:
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # TikTok 메타데이터 추출
            title = soup.find('meta', property='og:title')
            description = soup.find('meta', property='og:description')
            image = soup.find('meta', property='og:image')
            
            return {
                "title": title.get('content', 'TikTok Video') if title else "TikTok Video",
                "description": description.get('content', '') if description else "",
                "thumbnail": image.get('content', '') if image else "",
                "duration": "0",
                "author": "TikTok User"
            }
        except Exception as e:
            print(f"Error parsing TikTok URL: {e}")
            return {
                "title": "TikTok Video",
                "description": "",
                "thumbnail": "",
                "duration": "0",
                "author": "TikTok User"
            }
    
    # 기본 응답
    return {
        "title": "Unknown Video",
        "description": "",
        "thumbnail": "",
        "duration": "0",
        "author": "Unknown Author"
    }

# API 엔드포인트들
@app.get("/")
async def root():
    return {"message": "CloseTube API is running!"}

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
    try:
        videos_ref = db.collection('videos')
        docs = videos_ref.stream()
        
        videos = []
        for doc in docs:
            video_data = doc.to_dict()
            video_data['id'] = doc.id
            videos.append(VideoResponse(**video_data))
        
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"비디오 조회 실패: {str(e)}")

@app.get("/videos/group/{group}", response_model=List[VideoResponse])
async def get_videos_by_group(group: str):
    """특정 그룹의 비디오를 가져옵니다."""
    try:
        videos_ref = db.collection('videos')
        docs = videos_ref.where('group', '==', group).stream()
        
        videos = []
        for doc in docs:
            video_data = doc.to_dict()
            video_data['id'] = doc.id
            videos.append(VideoResponse(**video_data))
        
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"그룹별 비디오 조회 실패: {str(e)}")

@app.get("/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str):
    """특정 비디오를 가져옵니다."""
    try:
        video_ref = db.collection('videos').document(video_id)
        doc = video_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="비디오를 찾을 수 없습니다")
        
        video_data = doc.to_dict()
        video_data['id'] = doc.id
        return VideoResponse(**video_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"비디오 조회 실패: {str(e)}")

@app.post("/videos", response_model=VideoResponse)
async def create_video(video: VideoCreate):
    """새 비디오를 생성합니다."""
    try:
        # URL에서 비디오 정보 파싱
        video_info = parse_video_url(video.url)
        
        # Firestore에 저장할 데이터
        video_data = {
            "title": video.title or video_info["title"],
            "description": video.description or video_info["description"],
            "url": video.url,
            "thumbnail": video_info["thumbnail"],
            "duration": video_info["duration"],
            "author": video_info["author"],
            "views": 0,
            "likes": 0,
            "comments": 0,
            "createdAt": datetime.now().isoformat(),
            "group": video.group,
            "privacy": video.privacy
        }
        
        # Firestore에 저장
        doc_ref = db.collection('videos').add(video_data)
        video_data['id'] = doc_ref[1].id
        
        return VideoResponse(**video_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"비디오 생성 실패: {str(e)}")

@app.post("/videos/{video_id}/like")
async def like_video(video_id: str):
    """비디오에 좋아요를 추가합니다."""
    try:
        video_ref = db.collection('videos').document(video_id)
        video_ref.update({
            'likes': firestore.Increment(1)
        })
        return {"message": "좋아요가 추가되었습니다"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"좋아요 처리 실패: {str(e)}")

@app.post("/videos/{video_id}/view")
async def increment_views(video_id: str):
    """비디오 조회수를 증가시킵니다."""
    try:
        video_ref = db.collection('videos').document(video_id)
        video_ref.update({
            'views': firestore.Increment(1)
        })
        return {"message": "조회수가 증가되었습니다"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"조회수 증가 실패: {str(e)}")

@app.get("/groups")
async def get_groups():
    """모든 그룹을 가져옵니다."""
    try:
        groups_ref = db.collection('groups')
        docs = groups_ref.stream()
        
        groups = []
        for doc in docs:
            group_data = doc.to_dict()
            group_data['id'] = doc.id
            groups.append(group_data)
        
        return groups
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"그룹 조회 실패: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 