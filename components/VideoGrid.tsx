'use client';

import { useState, useEffect } from 'react';
import { Video } from '@/types/video';
import VideoCard from './VideoCard';
import { Loader2 } from 'lucide-react';

// Inline API functions
const API_BASE_URL = 'https://mcp-hi.up.railway.app';

const getVideos = async (): Promise<Video[]> => {
  const response = await fetch(`${API_BASE_URL}/videos`);
  
  if (!response.ok) {
    throw new Error('비디오를 불러오는데 실패했습니다.');
  }
  
  return response.json();
};

const getVideosByGroup = async (group: string): Promise<Video[]> => {
  const response = await fetch(`${API_BASE_URL}/videos?group=${encodeURIComponent(group)}`);
  
  if (!response.ok) {
    throw new Error('비디오를 불러오는데 실패했습니다.');
  }
  
  return response.json();
};

interface VideoGridProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  onRecommend?: (video: Video) => void;
  onSaveMemory?: (video: Video) => void;
}

export default function VideoGrid({ videos, onVideoSelect, onRecommend, onSaveMemory }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-2">아직 업로드된 비디오가 없습니다.</p>
          <p className="text-sm text-gray-400">새로운 비디오를 업로드해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={() => onVideoSelect(video)}
          onRecommend={onRecommend ? () => onRecommend(video) : undefined}
          onSaveMemory={onSaveMemory ? () => onSaveMemory(video) : undefined}
        />
      ))}
    </div>
  );
} 