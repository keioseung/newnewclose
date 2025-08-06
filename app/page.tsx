'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import VideoGrid from '@/components/VideoGrid';
import UploadModal from '@/components/UploadModal';
import VideoModal from '@/components/VideoModal';
import StatsDashboard from '@/components/StatsDashboard';
import RecommendModal from '@/components/RecommendModal';
import MemoryBox from '@/components/MemoryBox';
import { Video } from '@/types/video';
import { FilterOptions } from '@/components/SearchBar';
import { RecommendationData } from '@/components/RecommendModal';
import { MemoryData } from '@/components/MemoryBox';

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [selectedVideoForAction, setSelectedVideoForAction] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    duration: 'all',
    group: [],
    sortBy: 'latest'
  });

  // 비디오 데이터 로드
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch('https://mcp-hi.up.railway.app/videos');
        const data = await response.json();
        setVideos(data);
        setFilteredVideos(data);
      } catch (error) {
        console.error('비디오 로드 실패:', error);
      }
    };
    loadVideos();
  }, []);

  // 검색 및 필터링 적용
  useEffect(() => {
    let filtered = [...videos];

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 그룹 필터링
    if (selectedGroup) {
      filtered = filtered.filter(video => video.group === selectedGroup);
    }

    // 플랫폼 필터링
    if (filters.platform.length > 0) {
      filtered = filtered.filter(video => {
        const platform = getVideoPlatform(video.url);
        return filters.platform.includes(platform);
      });
    }

    // 그룹 필터링 (고급 필터)
    if (filters.group.length > 0) {
      filtered = filtered.filter(video => filters.group.includes(video.group));
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    setFilteredVideos(filtered);
  }, [videos, searchQuery, selectedGroup, filters]);

  const getVideoPlatform = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    return 'Unknown';
  };

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleRecommend = (video: Video) => {
    setSelectedVideoForAction(video);
    setIsRecommendOpen(true);
  };

  const handleSaveMemory = (video: Video) => {
    setSelectedVideoForAction(video);
    setIsMemoryOpen(true);
  };

  const handleRecommendSubmit = async (recommendation: RecommendationData) => {
    try {
      // TODO: API 호출로 추천 데이터 저장
      console.log('추천 데이터:', recommendation);
      // 성공 메시지 표시
      alert(`${recommendation.friendIds.length}명의 친구에게 영상을 추천했습니다!`);
    } catch (error) {
      console.error('추천 실패:', error);
      alert('추천에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSaveMemorySubmit = async (memory: MemoryData) => {
    try {
      // TODO: API 호출로 추억 데이터 저장
      console.log('추억 데이터:', memory);
      // 성공 메시지 표시
      alert('추억이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('추억 저장 실패:', error);
      alert('추억 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
          onStatsClick={() => setIsStatsOpen(true)}
          onMemoryClick={() => setIsMemoryOpen(true)}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        
        {/* 비디오 그리드 */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <VideoGrid 
            videos={filteredVideos}
            onVideoSelect={handleVideoSelect}
            onRecommend={handleRecommend}
            onSaveMemory={handleSaveMemory}
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

      {/* 통계 대시보드 */}
      <StatsDashboard
        videos={videos}
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />

      {/* 영상 추천 모달 */}
      <RecommendModal
        video={selectedVideoForAction}
        isOpen={isRecommendOpen}
        onClose={() => {
          setIsRecommendOpen(false);
          setSelectedVideoForAction(null);
        }}
        onRecommend={handleRecommendSubmit}
      />

      {/* 추억 상자 모달 */}
      <MemoryBox
        isOpen={isMemoryOpen}
        onClose={() => {
          setIsMemoryOpen(false);
          setSelectedVideoForAction(null);
        }}
        onSaveMemory={handleSaveMemorySubmit}
      />
    </div>
  );
} 