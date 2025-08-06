'use client'

import { useState, useEffect } from 'react'
import { Bell, Heart, MessageCircle, Share2, User, Video, X, Check, Clock } from 'lucide-react'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'recommend' | 'friend' | 'system'
  title: string
  message: string
  userId?: string
  userName?: string
  userAvatar?: string
  videoId?: string
  videoTitle?: string
  isRead: boolean
  createdAt: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  // 임시 알림 데이터
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        title: '좋아요',
        message: '김민수가 당신의 영상에 좋아요를 눌렀습니다',
        userId: 'user1',
        userName: '김민수',
        userAvatar: '김',
        videoId: 'video1',
        videoTitle: '가족 여행 하이라이트',
        isRead: false,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        type: 'comment',
        title: '댓글',
        message: '이지영이 당신의 영상에 댓글을 남겼습니다',
        userId: 'user2',
        userName: '이지영',
        userAvatar: '이',
        videoId: 'video1',
        videoTitle: '가족 여행 하이라이트',
        isRead: false,
        createdAt: '2024-01-15T09:30:00Z'
      },
      {
        id: '3',
        type: 'recommend',
        title: '영상 추천',
        message: '박준호가 당신에게 영상을 추천했습니다',
        userId: 'user3',
        userName: '박준호',
        userAvatar: '박',
        videoId: 'video2',
        videoTitle: '팀 프로젝트 브레인스토밍',
        isRead: true,
        createdAt: '2024-01-15T08:00:00Z'
      },
      {
        id: '4',
        type: 'friend',
        title: '친구 요청',
        message: '최수진이 친구 요청을 보냈습니다',
        userId: 'user4',
        userName: '최수진',
        userAvatar: '최',
        isRead: false,
        createdAt: '2024-01-15T07:00:00Z'
      },
      {
        id: '5',
        type: 'system',
        title: '시스템 알림',
        message: '새로운 기능이 추가되었습니다. 추억 상자를 확인해보세요!',
        isRead: true,
        createdAt: '2024-01-15T06:00:00Z'
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })))
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'recommend':
        return <Share2 className="w-5 h-5 text-green-500" />
      case 'friend':
        return <User className="w-5 h-5 text-purple-500" />
      case 'system':
        return <Bell className="w-5 h-5 text-gray-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 border-red-200'
      case 'comment':
        return 'bg-blue-50 border-blue-200'
      case 'recommend':
        return 'bg-green-50 border-green-200'
      case 'friend':
        return 'bg-purple-50 border-purple-200'
      case 'system':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
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

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-large animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bell className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">알림</h2>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                모두 읽음
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            전체 ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            읽지 않음 ({unreadCount})
          </button>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'unread' ? '읽지 않은 알림이 없어요' : '알림이 없어요'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'unread' ? '모든 알림을 확인했습니다' : '새로운 알림이 오면 여기에 표시됩니다'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    notification.isRead 
                      ? getNotificationColor(notification.type)
                      : 'bg-white border-primary-200 shadow-soft'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          
                          {/* 사용자 정보 */}
                          {notification.userName && (
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">{notification.userAvatar}</span>
                              </div>
                              <span className="text-sm text-gray-700">{notification.userName}</span>
                            </div>
                          )}

                          {/* 비디오 정보 */}
                          {notification.videoTitle && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Video className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{notification.videoTitle}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(notification.createdAt)}</span>
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                                  title="읽음 표시"
                                >
                                  <Check className="w-3 h-3 text-gray-500" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="삭제"
                              >
                                <X className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 