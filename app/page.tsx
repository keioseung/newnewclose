'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import VideoGrid from '@/components/VideoGrid';
import UploadModal from '@/components/UploadModal';
import VideoModal from '@/components/VideoModal';
import { Video } from '@/types/video';

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleVideoUploaded = () => {
    // 비디오 업로드 후 그리드 새로고침
    window.location.reload();
  };

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group === '전체' ? undefined : group);
    // 모바일에서 그룹 선택 시 사이드바 닫기
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 - 모바일에서는 오버레이 */}
      <div className={`
        fixed inset-0 z-40 md:relative md:z-auto
        ${isSidebarOpen ? 'block' : 'hidden md:block'}
      `}>
        <div className="absolute inset-0 bg-black bg-opacity-50 md:hidden" 
             onClick={() => setIsSidebarOpen(false)} />
        <div className="relative h-full md:relative">
          <Sidebar onGroupSelect={handleGroupSelect} />
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* 헤더 */}
        <Header 
          onUploadClick={() => setIsUploadModalOpen(true)}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        {/* 비디오 그리드 */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <VideoGrid 
            selectedGroup={selectedGroup}
            onVideoSelect={handleVideoSelect}
          />
        </main>
      </div>

      {/* 업로드 모달 */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      {/* 비디오 모달 */}
      <VideoModal
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setSelectedVideo(null);
        }}
      />
    </div>
  );
} 