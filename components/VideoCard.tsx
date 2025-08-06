'use client'

import { Play, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Video } from '@/types/video'

interface VideoCardProps {
  video: Video
  onClick: () => void
  onRecommend?: () => void
  onSaveMemory?: () => void
}

export default function VideoCard({ video, onClick, onRecommend, onSaveMemory }: VideoCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group active:scale-95 md:active:scale-100"
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div className="relative aspect-video rounded-t-lg overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // 썸네일 로딩 실패 시 기본 이미지로 대체
            const target = e.target as HTMLImageElement;
            if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
              // YouTube 비디오인 경우 다른 해상도 시도
              const videoId = video.url.includes('v=') 
                ? video.url.split('v=')[1].split('&')[0]
                : video.url.split('youtu.be/')[1].split('?')[0];
              target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            } else {
              // 기본 썸네일
              target.src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=320&h=180&fit=crop&crop=center';
            }
          }}
        />
        
        {/* 재생 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-4 h-4 md:w-5 md:h-5 text-gray-800 ml-0.5 md:ml-1" />
          </div>
        </div>
        
        {/* 재생 시간 */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>

        {/* 액션 버튼들 */}
        <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onRecommend && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRecommend();
              }}
              className="p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
              title="친구에게 추천"
            >
              <Share2 className="w-3 h-3 text-gray-700" />
            </button>
          )}
          {onSaveMemory && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveMemory();
              }}
              className="p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
              title="추억으로 저장"
            >
              <Bookmark className="w-3 h-3 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* 비디오 정보 */}
      <div className="p-3 md:p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors text-sm md:text-base">
          {video.title}
        </h3>
        
        <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 truncate">{video.author}</span>
            <span className="text-xs">{video.createdAt}</span>
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <span>{video.views}회</span>
          </div>
        </div>

        {/* 통계 */}
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3 md:w-4 md:h-4" />
              <span>{video.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
              <span>{video.comments}</span>
            </div>
          </div>
          
          {/* 그룹 태그 */}
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            {video.group}
          </span>
        </div>
      </div>
    </div>
  )
} 