'use client'

import { useState } from 'react'
import { X, Send, Users, Heart, MessageCircle, Share2 } from 'lucide-react'
import { Video } from '@/types/video'

interface RecommendModalProps {
  video: Video | null
  isOpen: boolean
  onClose: () => void
  onRecommend: (recommendation: RecommendationData) => void
}

export interface RecommendationData {
  videoId: string
  friendIds: string[]
  message: string
  url: string
}

interface Friend {
  id: string
  name: string
  avatar: string
  isSelected: boolean
}

export default function RecommendModal({ video, isOpen, onClose, onRecommend }: RecommendModalProps) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 임시 친구 목록 (실제로는 API에서 가져올 예정)
  const [friends] = useState<Friend[]>([
    { id: '1', name: '김민수', avatar: '민', isSelected: false },
    { id: '2', name: '이지영', avatar: '지', isSelected: false },
    { id: '3', name: '박준호', avatar: '준', isSelected: false },
    { id: '4', name: '최수진', avatar: '수', isSelected: false },
    { id: '5', name: '정현우', avatar: '현', isSelected: false },
    { id: '6', name: '한소영', avatar: '소', isSelected: false },
  ])

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFriends.length === friends.length) {
      setSelectedFriends([])
    } else {
      setSelectedFriends(friends.map(f => f.id))
    }
  }

  const handleRecommend = async () => {
    if (!video || selectedFriends.length === 0) return

    setIsLoading(true)
    try {
      const recommendation: RecommendationData = {
        videoId: video.id,
        friendIds: selectedFriends,
        message: message.trim(),
        url: video.url
      }

      await onRecommend(recommendation)
      
      // 성공 후 초기화
      setSelectedFriends([])
      setMessage('')
      onClose()
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedFriends([])
    setMessage('')
    onClose()
  }

  if (!isOpen || !video) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-large animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Share2 className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">영상 추천하기</h2>
              <p className="text-sm text-gray-500">친구들에게 이 영상을 추천해보세요</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* 비디오 미리보기 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{video.author}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  <span>👁️ {video.views}</span>
                  <span>❤️ {video.likes}</span>
                  <span>💬 {video.comments}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 친구 선택 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">친구 선택</h3>
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {selectedFriends.length === friends.length ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleFriendToggle(friend.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedFriends.includes(friend.id)
                      ? 'border-accent-500 bg-accent-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      selectedFriends.includes(friend.id)
                        ? 'bg-accent-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {friend.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{friend.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 입력 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">추천 메시지</h3>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="친구들에게 한마디 남겨보세요... (예: 이 영상 너무 재밌어! 꼭 봐봐 😊)"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={200}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {message.length}/200
              </div>
            </div>
          </div>

          {/* 추천 이유 템플릿 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">빠른 메시지</h3>
            <div className="flex flex-wrap gap-2">
              {[
                '이 영상 너무 재밌어! 😊',
                '꼭 봐봐! 👍',
                '추억에 남을 것 같아 💕',
                '함께 보면 좋을 것 같아 👥',
                '이거 보면서 웃었어 😂',
                '감동적이야 🥺'
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(template)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {selectedFriends.length}명의 친구에게 추천
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleRecommend}
              disabled={selectedFriends.length === 0 || isLoading}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedFriends.length === 0 || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-glow'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>추천 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>추천하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 