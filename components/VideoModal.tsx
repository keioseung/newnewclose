'use client'

import { useState, useEffect } from 'react'
import { X, Heart, MessageCircle, Share, ThumbsUp } from 'lucide-react'
import ReactPlayer from 'react-player'
import { Video, Comment } from '@/types/video'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API 함수들
const videoApi = {
  like: async (id: string): Promise<void> => {
    await api.post(`/videos/${id}/like`)
  },
  incrementViews: async (id: string): Promise<void> => {
    await api.post(`/videos/${id}/view`)
  },
}

interface VideoModalProps {
  isOpen: boolean
  video: Video | null
  onClose: () => void
}

export default function VideoModal({ isOpen, video, onClose }: VideoModalProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 임시 댓글 데이터
  const mockComments: Comment[] = [
    {
      id: '1',
      author: '엄마',
      authorAvatar: 'https://via.placeholder.com/32x32/6366f1/ffffff?text=U',
      text: '정말 예쁘네요! 😍',
      createdAt: '1시간 전',
    },
    {
      id: '2',
      author: '아빠',
      authorAvatar: 'https://via.placeholder.com/32x32/10b981/ffffff?text=A',
      text: '잘 찍었어요!',
      createdAt: '2시간 전',
    },
  ]

  useEffect(() => {
    if (video) {
      setComments(mockComments)
      // 조회수 증가
      videoApi.incrementViews(video.id).catch(console.error)
    }
  }, [video])

  const handleLike = async () => {
    if (!video) return

    // Mock like functionality
    setIsLiked(!isLiked)
    toast.success(isLiked ? '좋아요를 취소했습니다' : '좋아요를 눌렀습니다')
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !video) return

    setIsSubmitting(true)
    try {
      // 실제로는 API 호출
      const comment: Comment = {
        id: Date.now().toString(),
        author: '마루니',
        authorAvatar: 'https://via.placeholder.com/32x32/3b82f6/ffffff?text=마',
        text: newComment,
        createdAt: '방금 전',
      }
      
      setComments([comment, ...comments])
      setNewComment('')
      toast.success('댓글이 작성되었습니다')
    } catch (error) {
      toast.error('댓글 작성에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    if (!video) return
    
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('링크가 클립보드에 복사되었습니다')
    }
  }

  if (!isOpen || !video) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{video.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* 비디오 플레이어 */}
          <div className="flex-1 p-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <ReactPlayer
                url={video.url}
                width="100%"
                height="100%"
                controls
                playing
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                    },
                  },
                }}
              />
            </div>

            {/* 비디오 정보 */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {video.title}
              </h3>
              <p className="text-gray-600 mb-4">{video.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span>{video.author}</span>
                  <span>{video.createdAt}</span>
                  <span>{video.views}회 시청</span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center space-x-4 border-t border-gray-200 pt-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{video.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{video.comments + comments.length}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share className="w-5 h-5" />
                  <span>공유</span>
                </button>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="w-full lg:w-96 border-l border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">댓글</h4>
            
            {/* 댓글 입력 */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">마</span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  작성
                </button>
              </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 