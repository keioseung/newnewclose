'use client'

import { useState } from 'react'
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