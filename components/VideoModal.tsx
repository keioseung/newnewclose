'use client';

import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Share2, Eye, Loader2 } from 'lucide-react';
import { Video } from '@/types/video';
import toast from 'react-hot-toast';

// Inline API functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mcp-hi.up.railway.app';

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

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (video && isOpen) {
      setCurrentVideo(video);
      // 비디오 조회수 증가
      handleIncrementView();
    }
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

  if (!isOpen || !currentVideo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{currentVideo.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 비디오 플레이어 */}
        <div className="relative bg-black">
          <div className="aspect-video">
            <iframe
              src={currentVideo.url}
              title={currentVideo.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* 비디오 정보 */}
        <div className="p-6 space-y-4">
          {/* 제목과 작성자 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentVideo.title}
            </h3>
            <p className="text-sm text-gray-600">
              {currentVideo.author} • {currentVideo.createdAt}
            </p>
          </div>

          {/* 설명 */}
          <p className="text-gray-700">{currentVideo.description}</p>

          {/* 통계 */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{currentVideo.views}회 시청</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{currentVideo.likes}개 좋아요</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{currentVideo.comments}개 댓글</span>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              좋아요
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
              <MessageCircle className="w-4 h-4" />
              댓글
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Share2 className="w-4 h-4" />
              공유
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