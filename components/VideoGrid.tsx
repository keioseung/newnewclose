'use client';

import { useState, useEffect } from 'react';
import { Video } from '@/types/video';
import VideoCard from './VideoCard';
import { videoAPI } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface VideoGridProps {
  selectedGroup?: string;
  onVideoSelect: (video: Video) => void;
}

export default function VideoGrid({ selectedGroup, onVideoSelect }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let fetchedVideos: Video[];
        if (selectedGroup) {
          fetchedVideos = await videoAPI.getVideosByGroup(selectedGroup);
        } else {
          fetchedVideos = await videoAPI.getVideos();
        }
        
        setVideos(fetchedVideos);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError('비디오를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [selectedGroup]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">비디오를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-2">
            {selectedGroup ? `${selectedGroup} 그룹에 비디오가 없습니다.` : '아직 업로드된 비디오가 없습니다.'}
          </p>
          <p className="text-sm text-gray-400">새로운 비디오를 업로드해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={() => onVideoSelect(video)}
        />
      ))}
    </div>
  );
} 