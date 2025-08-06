'use client'

import { useState } from 'react'
import { Search, Plus, Menu, Bell, BarChart3, Settings, User, Heart, Users } from 'lucide-react'
import SearchBar, { FilterOptions } from './SearchBar'

interface HeaderProps {
  onUploadClick: () => void
  onMenuClick: () => void
  onStatsClick: () => void
  onMemoryClick: () => void
  onNotificationClick: () => void
  onFriendClick: () => void
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterOptions) => void
}

export default function Header({ onUploadClick, onMenuClick, onStatsClick, onMemoryClick, onNotificationClick, onFriendClick, onSearch, onFilterChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 shadow-soft">
      <div className="flex items-center justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 md:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* 로고 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">CloseTube</h1>
              <p className="text-xs text-gray-500">Private Video Sharing</p>
            </div>
          </div>
        </div>

        {/* 중앙 검색바 */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <SearchBar onSearch={onSearch} onFilterChange={onFilterChange} />
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* 통계 버튼 */}
          <button
            onClick={onStatsClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-primary-600"
            title="통계 보기"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          {/* 추억 상자 버튼 */}
          <button
            onClick={onMemoryClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-accent-600"
            title="추억 상자"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* 친구 관리 버튼 */}
          <button
            onClick={onFriendClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-primary-600"
            title="친구 관리"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* 업로드 버튼 */}
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 bg-gradient-primary text-white px-4 py-2.5 rounded-xl hover:shadow-glow transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">영상 업로드</span>
          </button>

          {/* 알림 */}
          <button 
            onClick={onNotificationClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium animate-pulse-slow">
              3
            </span>
          </button>

          {/* 사용자 프로필 */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
              <span className="text-white text-sm font-semibold">마</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">마루니</p>
              <p className="text-xs text-gray-500">Premium</p>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 검색바 */}
      <div className="mt-3 md:hidden">
        <SearchBar onSearch={onSearch} onFilterChange={onFilterChange} />
      </div>
    </header>
  )
} 