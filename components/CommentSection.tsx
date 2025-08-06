'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Heart, Reply, MoreVertical, Send, Smile } from 'lucide-react'

interface Comment {
  id: string
  videoId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  likes: number
  replies: Reply[]
  createdAt: string
  isLiked: boolean
}

interface Reply {
  id: string
  commentId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  likes: number
  createdAt: string
  isLiked: boolean
}

interface CommentSectionProps {
  videoId: string
  isOpen: boolean
  onClose: () => void
}

export default function CommentSection({ videoId, isOpen, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 임시 댓글 데이터
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        videoId,
        userId: 'user1',
        userName: '김민수',
        userAvatar: '김',
        content: '정말 재미있는 영상이네요! 공유해주셔서 감사합니다 😊',
        likes: 5,
        replies: [
          {
            id: 'reply1',
            commentId: '1',
            userId: 'user2',
            userName: '이지영',
            userAvatar: '이',
            content: '저도 같은 생각이에요!',
            likes: 2,
            createdAt: '2024-01-15T10:30:00Z',
            isLiked: false
          }
        ],
        createdAt: '2024-01-15T10:00:00Z',
        isLiked: false
      },
      {
        id: '2',
        videoId,
        userId: 'user3',
        userName: '박준호',
        userAvatar: '박',
        content: '이런 영상이 정말 필요했어요. 다음에도 좋은 영상 부탁드려요!',
        likes: 3,
        replies: [],
        createdAt: '2024-01-15T09:30:00Z',
        isLiked: true
      }
    ]
    setComments(mockComments)
  }, [videoId])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        videoId,
        userId: 'currentUser',
        userName: '마루니',
        userAvatar: '마',
        content: newComment,
        likes: 0,
        replies: [],
        createdAt: new Date().toISOString(),
        isLiked: false
      }

      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('댓글 작성 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) return

    setIsLoading(true)
    try {
      const reply: Reply = {
        id: Date.now().toString(),
        commentId,
        userId: 'currentUser',
        userName: '마루니',
        userAvatar: '마',
        content: replyContent,
        likes: 0,
        createdAt: new Date().toISOString(),
        isLiked: false
      }

      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ))
      setReplyContent('')
      setReplyingTo(null)
    } catch (error) {
      console.error('답글 작성 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked 
          }
        : comment
    ))
  }

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId
                ? {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked
                  }
                : reply
            )
          }
        : comment
    ))
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return `${Math.floor(diffInMinutes / 1440)}일 전`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-large animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">댓글</h2>
              <p className="text-sm text-gray-500">{comments.length}개의 댓글</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 댓글 입력 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">마</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Smile className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{newComment.length}/500</span>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isLoading}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      !newComment.trim() || isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>작성 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>댓글 작성</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">아직 댓글이 없어요</h3>
                <p className="text-gray-500">첫 번째 댓글을 남겨보세요!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* 메인 댓글 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">{comment.userAvatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{comment.userName}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <MoreVertical className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-800 mb-3">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                            <span>{comment.likes}</span>
                          </button>
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <Reply className="w-4 h-4" />
                            <span>답글</span>
                          </button>
                        </div>
                      </div>

                      {/* 답글 입력 */}
                      {replyingTo === comment.id && (
                        <div className="mt-3 ml-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-medium">마</span>
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="답글을 입력하세요..."
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                                rows={2}
                                maxLength={300}
                              />
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">{replyContent.length}/300</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    취소
                                  </button>
                                  <button
                                    onClick={() => handleSubmitReply(comment.id)}
                                    disabled={!replyContent.trim() || isLoading}
                                    className={`px-3 py-1 text-sm rounded font-medium transition-all duration-200 ${
                                      !replyContent.trim() || isLoading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary-500 text-white hover:bg-primary-600'
                                    }`}
                                  >
                                    답글 작성
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 답글 목록 */}
                      {comment.replies.length > 0 && (
                        <div className="ml-4 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-medium">{reply.userAvatar}</span>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 text-sm">{reply.userName}</span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-500">{formatTime(reply.createdAt)}</span>
                                      <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <MoreVertical className="w-3 h-3 text-gray-500" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-gray-800 text-sm mb-2">{reply.content}</p>
                                  <button
                                    onClick={() => handleLikeReply(comment.id, reply.id)}
                                    className={`flex items-center space-x-1 text-xs transition-colors ${
                                      reply.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                                    }`}
                                  >
                                    <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                    <span>{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 