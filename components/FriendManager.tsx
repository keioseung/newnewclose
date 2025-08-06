'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, UserCheck, UserX, Search, MoreVertical, MessageCircle, Video, Heart } from 'lucide-react'

interface Friend {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  mutualFriends: number
  sharedVideos: number
  lastActive: string
  isOnline: boolean
}

interface FriendRequest {
  id: string
  userId: string
  userName: string
  userAvatar: string
  message?: string
  createdAt: string
}

interface FriendManagerProps {
  isOpen: boolean
  onClose: () => void
}

export default function FriendManager({ isOpen, onClose }: FriendManagerProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends')
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all')

  // 임시 데이터
  useEffect(() => {
    const mockFriends: Friend[] = [
      {
        id: '1',
        name: '김민수',
        avatar: '김',
        status: 'online',
        mutualFriends: 5,
        sharedVideos: 12,
        lastActive: '2024-01-15T10:00:00Z',
        isOnline: true
      },
      {
        id: '2',
        name: '이지영',
        avatar: '이',
        status: 'away',
        mutualFriends: 8,
        sharedVideos: 7,
        lastActive: '2024-01-15T09:30:00Z',
        isOnline: true
      },
      {
        id: '3',
        name: '박준호',
        avatar: '박',
        status: 'offline',
        mutualFriends: 3,
        sharedVideos: 15,
        lastActive: '2024-01-15T08:00:00Z',
        isOnline: false
      }
    ]

    const mockRequests: FriendRequest[] = [
      {
        id: '1',
        userId: 'user4',
        userName: '최수진',
        userAvatar: '최',
        message: '안녕하세요! 영상 공유하고 싶어서 친구 요청 보냈어요 😊',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        userId: 'user5',
        userName: '정현우',
        userAvatar: '정',
        createdAt: '2024-01-15T09:00:00Z'
      }
    ]

    setFriends(mockFriends)
    setFriendRequests(mockRequests)
  }, [])

  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId)
    if (request) {
      const newFriend: Friend = {
        id: request.userId,
        name: request.userName,
        avatar: request.userAvatar,
        status: 'offline',
        mutualFriends: 1,
        sharedVideos: 0,
        lastActive: new Date().toISOString(),
        isOnline: false
      }
      setFriends(prev => [...prev, newFriend])
      setFriendRequests(prev => prev.filter(r => r.id !== requestId))
    }
  }

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId))
  }

  const handleRemoveFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
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

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || friend.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-large animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">친구 관리</h2>
              <p className="text-sm text-gray-500">
                {activeTab === 'friends' && `${friends.length}명의 친구`}
                {activeTab === 'requests' && `${friendRequests.length}개의 친구 요청`}
                {activeTab === 'suggestions' && '친구 추천'}
              </p>
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

        {/* 탭 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            친구 ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            친구 요청 ({friendRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            친구 추천
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'friends' && (
            <div className="p-6">
              {/* 검색 및 필터 */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="친구 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  {(['all', 'online', 'offline'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? '전체' : status === 'online' ? '온라인' : '오프라인'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 친구 목록 */}
              <div className="space-y-4">
                {filteredFriends.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">친구가 없어요</h3>
                    <p className="text-gray-500">새로운 친구를 추가해보세요!</p>
                  </div>
                ) : (
                  filteredFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{friend.avatar}</span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{friend.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>공통 친구 {friend.mutualFriends}명</span>
                            <span>공유 영상 {friend.sharedVideos}개</span>
                            <span>{formatTime(friend.lastActive)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="메시지">
                          <MessageCircle className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="영상 공유">
                          <Video className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="더보기">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-6">
              {friendRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">친구 요청이 없어요</h3>
                  <p className="text-gray-500">새로운 친구 요청이 오면 여기에 표시됩니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{request.userAvatar}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{request.userName}</h4>
                          {request.message && (
                            <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">{formatTime(request.createdAt)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>수락</span>
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="flex items-center space-x-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <UserX className="w-4 h-4" />
                            <span>거절</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">친구 추천</h3>
                <p className="text-gray-500">곧 친구 추천 기능이 추가될 예정입니다!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 