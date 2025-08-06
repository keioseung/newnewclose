'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Eye, Heart, Clock, Users, Video, BarChart3 } from 'lucide-react'
import { Video as VideoType } from '@/types/video'

interface StatsDashboardProps {
  videos: VideoType[]
  isOpen: boolean
  onClose: () => void
}

interface Stats {
  totalVideos: number
  totalViews: number
  totalLikes: number
  totalDuration: string
  platformDistribution: { platform: string; count: number }[]
  groupDistribution: { group: string; count: number }[]
  recentActivity: { date: string; count: number }[]
}

export default function StatsDashboard({ videos, isOpen, onClose }: StatsDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalDuration: '0:00',
    platformDistribution: [],
    groupDistribution: [],
    recentActivity: []
  })

  useEffect(() => {
    if (videos.length > 0) {
      calculateStats()
    }
  }, [videos])

  const calculateStats = () => {
    const totalVideos = videos.length
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0)
    const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0)
    
    // 플랫폼별 분포
    const platformCount: { [key: string]: number } = {}
    videos.forEach(video => {
      let platform = 'Unknown'
      if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
        platform = 'YouTube'
      } else if (video.url.includes('instagram.com')) {
        platform = 'Instagram'
      } else if (video.url.includes('tiktok.com')) {
        platform = 'TikTok'
      }
      platformCount[platform] = (platformCount[platform] || 0) + 1
    })
    
    const platformDistribution = Object.entries(platformCount).map(([platform, count]) => ({
      platform,
      count
    }))

    // 그룹별 분포
    const groupCount: { [key: string]: number } = {}
    videos.forEach(video => {
      groupCount[video.group] = (groupCount[video.group] || 0) + 1
    })
    
    const groupDistribution = Object.entries(groupCount).map(([group, count]) => ({
      group,
      count
    }))

    // 최근 활동 (최근 7일)
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = videos.filter(video => 
        video.createdAt.startsWith(dateStr)
      ).length
      return { date: dateStr, count }
    }).reverse()

    setStats({
      totalVideos,
      totalViews,
      totalLikes,
      totalDuration: '0:00', // 실제로는 duration 파싱 필요
      platformDistribution,
      groupDistribution,
      recentActivity
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-large animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">통계 대시보드</h2>
              <p className="text-sm text-gray-500">비디오 활동 현황을 한눈에 확인하세요</p>
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

        {/* 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 주요 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-primary rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">총 비디오</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.totalVideos)}</p>
                </div>
                <Video className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-accent rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">총 조회수</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
                </div>
                <Eye className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-dark rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">총 좋아요</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.totalLikes)}</p>
                </div>
                <Heart className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-primary-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">평균 조회수</p>
                  <p className="text-2xl font-bold">
                    {stats.totalVideos > 0 ? formatNumber(Math.round(stats.totalViews / stats.totalVideos)) : '0'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* 차트 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 플랫폼별 분포 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">플랫폼별 분포</h3>
              <div className="space-y-4">
                {stats.platformDistribution.map((item, index) => {
                  const percentage = stats.totalVideos > 0 ? (item.count / stats.totalVideos) * 100 : 0
                  const colors = ['bg-primary-500', 'bg-accent-500', 'bg-dark-500', 'bg-gray-500']
                  
                  return (
                    <div key={item.platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{item.platform}</span>
                        <span className="text-sm text-gray-500">{item.count}개 ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 그룹별 분포 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">그룹별 분포</h3>
              <div className="space-y-4">
                {stats.groupDistribution.map((item, index) => {
                  const percentage = stats.totalVideos > 0 ? (item.count / stats.totalVideos) * 100 : 0
                  const colors = ['bg-primary-500', 'bg-accent-500', 'bg-dark-500', 'bg-gray-500', 'bg-green-500', 'bg-yellow-500']
                  
                  return (
                    <div key={item.group} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{item.group}</span>
                        <span className="text-sm text-gray-500">{item.count}개 ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 7일 활동</h3>
            <div className="flex items-end justify-between h-32 space-x-2">
              {stats.recentActivity.map((item, index) => {
                const maxCount = Math.max(...stats.recentActivity.map(d => d.count))
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                const date = new Date(item.date)
                const dayName = date.toLocaleDateString('ko-KR', { weekday: 'short' })
                
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center space-y-2">
                    <div className="text-xs text-gray-500">{dayName}</div>
                    <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '80px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-primary-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="text-xs font-medium text-gray-700">{item.count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 