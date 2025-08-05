'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import VideoGrid from '@/components/VideoGrid'
import UploadModal from '@/components/UploadModal'
import VideoModal from '@/components/VideoModal'
import { Video } from '@/types/video'

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [currentFilter, setCurrentFilter] = useState('전체')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 초기 로딩 상태 처리
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 에러 발생 시 fallback UI
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">CloseTube를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const handleUploadClick = () => {
    setIsUploadModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onUploadClick={handleUploadClick} />
        
        <main className="flex-1 overflow-y-auto">
          <VideoGrid 
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            onVideoClick={handleVideoClick}
          />
        </main>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        video={selectedVideo}
        onClose={() => {
          setIsVideoModalOpen(false)
          setSelectedVideo(null)
        }}
      />
    </div>
  )
} 