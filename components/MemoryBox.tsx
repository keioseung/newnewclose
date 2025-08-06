'use client'

import { useState, useEffect } from 'react'
import { Heart, Bookmark, Calendar, Users, Star, Plus, X, Edit3, Trash2 } from 'lucide-react'
import { Video } from '@/types/video'

interface MemoryBoxProps {
  isOpen: boolean
  onClose: () => void
  onSaveMemory: (memory: MemoryData) => void
}

export interface MemoryData {
  id?: string
  videoId: string
  title: string
  description: string
  tags: string[]
  importance: 'low' | 'medium' | 'high'
  sharedWith: string[]
  createdAt: string
}

interface Memory extends MemoryData {
  id: string
  video: Video
}

export default function MemoryBox({ isOpen, onClose, onSaveMemory }: MemoryBoxProps) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isAddMode, setIsAddMode] = useState(false)
  const [newMemory, setNewMemory] = useState<Partial<MemoryData>>({
    title: '',
    description: '',
    tags: [],
    importance: 'medium',
    sharedWith: []
  })

  // 임시 메모리 데이터 (실제로는 API에서 가져올 예정)
  useEffect(() => {
    const mockMemories: Memory[] = [
      {
        id: '1',
        videoId: '1',
        title: '우리 가족 여행 추억',
        description: '올해 여름 가족과 함께한 특별한 여행. 모두가 웃고 있는 모습이 너무 소중해.',
        tags: ['가족', '여행', '여름'],
        importance: 'high',
        sharedWith: ['김민수', '이지영'],
        createdAt: '2024-01-15',
        video: {
          id: '1',
          title: '가족 여행 하이라이트',
          description: '올해 여름 가족과 함께한 특별한 여행',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: '3:24',
          author: '엄마',
          views: 15,
          likes: 8,
          comments: 3,
          createdAt: '2024-01-15',
          group: '가족',
          privacy: { downloadDisabled: true, externalShareDisabled: true }
        }
      },
      {
        id: '2',
        videoId: '2',
        title: '팀 프로젝트 성공',
        description: '힘들었지만 결국 성공한 프로젝트. 팀원들과의 협업이 인상적이었어.',
        tags: ['팀워크', '성공', '협업'],
        importance: 'medium',
        sharedWith: ['박준호'],
        createdAt: '2024-01-10',
        video: {
          id: '2',
          title: '팀 프로젝트 브레인스토밍',
          description: '새로운 아이디어를 위한 팀 회의',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          duration: '15:32',
          author: '팀장 지영',
          views: 8,
          likes: 5,
          comments: 2,
          createdAt: '2024-01-10',
          group: '팀 프로젝트',
          privacy: { downloadDisabled: true, externalShareDisabled: true }
        }
      }
    ]
    setMemories(mockMemories)
  }, [])

  const handleAddMemory = () => {
    if (!selectedVideo || !newMemory.title) return

    const memory: MemoryData = {
      videoId: selectedVideo.id,
      title: newMemory.title,
      description: newMemory.description || '',
      tags: newMemory.tags || [],
      importance: newMemory.importance || 'medium',
      sharedWith: newMemory.sharedWith || [],
      createdAt: new Date().toISOString().split('T')[0]
    }

    onSaveMemory(memory)
    setIsAddMode(false)
    setSelectedVideo(null)
    setNewMemory({
      title: '',
      description: '',
      tags: [],
      importance: 'medium',
      sharedWith: []
    })
  }

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(m => m.id !== memoryId))
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-500 bg-red-50'
      case 'medium': return 'text-yellow-500 bg-yellow-50'
      case 'low': return 'text-green-500 bg-green-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high': return '🔥'
      case 'medium': return '⭐'
      case 'low': return '💚'
      default: return '📌'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-large animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Heart className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">추억 상자</h2>
              <p className="text-sm text-gray-500">소중한 영상들을 추억으로 저장하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddMode(true)}
              className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>추억 추가</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isAddMode ? (
            /* 추억 추가 모드 */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">새로운 추억 추가</h3>
                <button
                  onClick={() => setIsAddMode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 비디오 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  영상 선택
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {memories.map(memory => (
                    <button
                      key={memory.id}
                      onClick={() => setSelectedVideo(memory.video)}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        selectedVideo?.id === memory.video.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={memory.video.thumbnail}
                          alt={memory.video.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{memory.video.title}</h4>
                          <p className="text-sm text-gray-500">{memory.video.author}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 추억 정보 입력 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    추억 제목 *
                  </label>
                  <input
                    type="text"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="이 추억의 제목을 입력하세요"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    중요도
                  </label>
                  <select
                    value={newMemory.importance}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, importance: e.target.value as any }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">낮음 💚</option>
                    <option value="medium">보통 ⭐</option>
                    <option value="high">높음 🔥</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추억 설명
                </label>
                <textarea
                  value={newMemory.description}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="이 추억에 대한 설명을 입력하세요..."
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그
                </label>
                <input
                  type="text"
                  placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 가족, 여행, 여름)"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onBlur={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    setNewMemory(prev => ({ ...prev, tags }))
                  }}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddMode(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddMemory}
                  disabled={!selectedVideo || !newMemory.title}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !selectedVideo || !newMemory.title
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-glow'
                  }`}
                >
                  추억 저장
                </button>
              </div>
            </div>
          ) : (
            /* 추억 목록 보기 */
            <div className="space-y-6">
              {memories.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">아직 저장된 추억이 없어요</h3>
                  <p className="text-gray-500 mb-4">소중한 영상들을 추억으로 저장해보세요</p>
                  <button
                    onClick={() => setIsAddMode(true)}
                    className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    첫 번째 추억 추가하기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memories.map((memory) => (
                    <div key={memory.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-200">
                      {/* 비디오 썸네일 */}
                      <div className="relative mb-4">
                        <img
                          src={memory.video.thumbnail}
                          alt={memory.video.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(memory.importance)}`}>
                            {getImportanceIcon(memory.importance)}
                          </span>
                        </div>
                      </div>

                      {/* 추억 정보 */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">{memory.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{memory.description}</p>
                        
                        {/* 태그 */}
                        {memory.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {memory.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 메타 정보 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{memory.createdAt}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-3 h-3" />
                            <span>{memory.sharedWith.length}명과 공유</span>
                          </div>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            <Edit3 className="w-4 h-4 inline mr-1" />
                            편집
                          </button>
                          <button
                            onClick={() => handleDeleteMemory(memory.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 