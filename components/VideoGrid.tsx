'use client'

import { useState, useEffect } from 'react'
import { Video } from '@/types/video'
import VideoCard from './VideoCard'
import { videoApi } from '@/lib/api'

interface VideoGridProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  onVideoClick: (video: Video) => void
}

const filters = [
  { id: '전체', label: '전체' },
  { id: '최신순', label: '최신순' },
  { id: '인기순', label: '인기순' },
  { id: '가족', label: '가족' },
  { id: '친구들', label: '친구들' },
  { id: '팀 프로젝트', label: '팀 프로젝트' },
]

// 임시 데이터
const mockVideos: Video[] = [
  {
    id: '1',
    title: '가족 여행 하이라이트',
    description: '올해 여름 가족과 함께한 특별한 여행',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=가족+여행',
    duration: '3:24',
    author: '엄마',
    views: 12,
    likes: 8,
    comments: 3,
    createdAt: '2일 전',
    group: '가족',
    privacy: {
      downloadDisabled: true,
      externalShareDisabled: true,
    },
  },
  {
    id: '2',
    title: '파스타 만들기 클래스',
    description: '집에서 쉽게 만드는 맛있는 파스타',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://via.placeholder.com/320x180/10b981/ffffff?text=요리+클래스',
    duration: '8:15',
    author: '친구 민수',
    views: 5,
    likes: 12,
    comments: 7,
    createdAt: '1주일 전',
    group: '친구들',
    privacy: {
      downloadDisabled: true,
      externalShareDisabled: true,
    },
  },
  {
    id: '3',
    title: '팀 프로젝트 브레인스토밍',
    description: '새로운 아이디어를 위한 팀 회의',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://via.placeholder.com/320x180/f59e0b/ffffff?text=프로젝트+회의',
    duration: '15:32',
    author: '팀장 지영',
    views: 3,
    likes: 5,
    comments: 2,
    createdAt: '3일 전',
    group: '팀 프로젝트',
    privacy: {
      downloadDisabled: true,
      externalShareDisabled: true,
    },
  },
  {
    id: '4',
    title: '동생 생일 파티',
    description: '동생의 특별한 생일 축하',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://via.placeholder.com/320x180/8b5cf6/ffffff?text=생일+파티',
    duration: '5:48',
    author: '아빠',
    views: 18,
    likes: 15,
    comments: 8,
    createdAt: '1주일 전',
    group: '가족',
    privacy: {
      downloadDisabled: true,
      externalShareDisabled: true,
    },
  },
  {
    id: '5',
    title: '홈 트레이닝 루틴',
    description: '집에서 할 수 있는 효과적인 운동',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://via.placeholder.com/320x180/ef4444/ffffff?text=운동+루틴',
    duration: '12:05',
    author: '친구 수진',
    views: 7,
    likes: 9,
    comments: 4,
    createdAt: '2주일 전',
    group: '친구들',
    privacy: {
      downloadDisabled: true,
      externalShareDisabled: true,
    },
  },
  {
    id: '6',
    title: 'React 컴포넌트 만들기',
    description: 'React로 재사용 가능한 컴포넌트 개발',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://via.placeholder.com/320x180/06b6d4/ffffff?text=코딩+튜토리얼',
    duration: '22:18',
    author: '팀원 준호',
    views: 4,
    likes: 6,
    comments: 3,
    createdAt: '1주일 전',
    group: '팀 프로젝트',
    privacy: {
      downloadDisabled: true,
      externalShareDisabled: true,
    },
  },
]

export default function VideoGrid({ currentFilter, onFilterChange, onVideoClick }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      try {
        let fetchedVideos: Video[]
        if (currentFilter === '전체') {
          fetchedVideos = await videoApi.getAll()
        } else if (['가족', '친구들', '팀 프로젝트'].includes(currentFilter)) {
          fetchedVideos = await videoApi.getByGroup(currentFilter)
        } else {
          fetchedVideos = await videoApi.getAll()
        }
        setVideos(fetchedVideos)
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        // 에러 시에도 mock 데이터 유지
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [currentFilter])

  const filteredVideos = videos.filter(video => {
    if (currentFilter === '전체') return true
    if (['가족', '친구들', '팀 프로젝트'].includes(currentFilter)) {
      return video.group === currentFilter
    }
    return true
  })

  return (
    <div className="p-6">
      {/* 필터 버튼들 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentFilter === filter.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* 비디오 그리드 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick(video)}
            />
          ))}
        </div>
      )}

      {!loading && filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">영상이 없습니다</div>
          <div className="text-gray-400 text-sm">
            {currentFilter === '전체' 
              ? '첫 번째 영상을 업로드해보세요!' 
              : `${currentFilter} 그룹에 영상이 없습니다.`
            }
          </div>
        </div>
      )}
    </div>
  )
} 