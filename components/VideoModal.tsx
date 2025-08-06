'use client';

import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Share2, Eye, Loader2, ArrowLeft } from 'lucide-react';
import { Video } from '@/types/video';
import toast from 'react-hot-toast';

// Inline API functions
const API_BASE_URL = 'https://mcp-hi.up.railway.app';

const incrementView = async (videoId: string): Promise<Video> => {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/view`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('조회수 증가에 실패했습니다.');
  }

  return response.json();
};

const likeVideo = async (videoId: string): Promise<Video> => {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }

  return response.json();
};

// YouTube URL을 임베드 URL로 변환하는 함수
const getEmbedUrl = (url: string): string => {
  // YouTube 처리
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  
  // Instagram 처리
  else if (url.includes('instagram.com/p/')) {
    const postId = url.split('/p/')[1]?.split('/')[0];
    return postId ? `https://www.instagram.com/p/${postId}/embed/` : url;
  } else if (url.includes('instagram.com/reel/')) {
    const reelId = url.split('/reel/')[1]?.split('/')[0];
    return reelId ? `https://www.instagram.com/reel/${reelId}/embed/` : url;
  }
  
  // TikTok 처리
  else if (url.includes('tiktok.com/') && url.includes('/video/')) {
    const videoId = url.split('/video/')[1]?.split('?')[0];
    return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : url;
  }
  
  return url;
};

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onCommentClick?: () => void;
}

export default function VideoModal({ video, isOpen, onClose, onCommentClick }: VideoModalProps) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (video && isOpen) {
      setCurrentVideo(video);
      // 비디오 조회수 증가
      handleIncrementView();
      // 모바일에서 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [video, isOpen]);

  const handleIncrementView = async () => {
    if (!video) return;
    
    try {
      const updatedVideo = await incrementView(video.id);
      setCurrentVideo(updatedVideo);
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
  };

  const handleLike = async () => {
    if (!currentVideo) return;
    
    setIsLoading(true);
    try {
      const updatedVideo = await likeVideo(currentVideo.id);
      setCurrentVideo(updatedVideo);
      toast.success('좋아요가 추가되었습니다!');
    } catch (error) {
      console.error('좋아요 실패:', error);
      toast.error('좋아요 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (!currentVideo) return;
    
    if (navigator.share) {
      navigator.share({
        title: currentVideo.title,
        text: currentVideo.description,
        url: currentVideo.url,
      });
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(currentVideo.url);
      toast.success('링크가 클립보드에 복사되었습니다!');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !currentVideo) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* 모바일 최적화된 모달 */}
      <div className="bg-white w-full h-full md:w-auto md:h-auto md:max-w-4xl md:max-h-[90vh] md:rounded-2xl md:overflow-hidden flex flex-col">
        {/* 헤더 - 모바일에서는 상단 고정 */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              {currentVideo.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 비디오 플레이어 - 모바일에서 전체 화면 */}
        <div className="relative bg-black flex-1">
          <div className="w-full h-full">
            <iframe
              src={getEmbedUrl(currentVideo.url)}
              title={currentVideo.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* 비디오 정보 - 모바일에서 스크롤 가능 */}
        <div className="p-4 md:p-6 space-y-4 bg-white flex-shrink-0 max-h-[40vh] md:max-h-none overflow-y-auto">
          {/* 제목과 작성자 */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              {currentVideo.title}
            </h3>
            <p className="text-sm text-gray-600">
              {currentVideo.author} • {currentVideo.createdAt}
            </p>
          </div>

          {/* 설명 */}
          <p className="text-gray-700 text-sm md:text-base">{currentVideo.description}</p>

          {/* 통계 - 모바일에서 더 컴팩트하게 */}
          <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{currentVideo.views}회</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{currentVideo.likes}개</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{currentVideo.comments}개</span>
            </div>
          </div>

          {/* 액션 버튼들 - 모바일에서 더 큰 터치 영역 */}
          <div className="flex items-center gap-3 md:gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              <span className="hidden md:inline">좋아요</span>
            </button>
            
            <button 
              onClick={onCommentClick}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">댓글</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">공유</span>
            </button>
          </div>

          {/* 그룹 정보 */}
          <div className="pt-4 border-t border-gray-200">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
              {currentVideo.group}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 