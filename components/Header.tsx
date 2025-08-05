'use client'

import { useState } from 'react'
import { Search, Plus, Menu, Bell } from 'lucide-react'

interface HeaderProps {
  onUploadClick: () => void
}

export default function Header({ onUploadClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* 검색바 */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="영상 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center space-x-4">
          {/* 업로드 버튼 */}
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">영상 업로드</span>
          </button>

          {/* 알림 */}
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* 사용자 프로필 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">마</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">마루니</span>
          </div>
        </div>
      </div>

      {/* 모바일 검색바 */}
      <div className="mt-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="영상 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  )
} 