'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Sparkles } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterOptions) => void
  placeholder?: string
}

export interface FilterOptions {
  platform: string[]
  duration: string
  group: string[]
  sortBy: string
}

export default function SearchBar({ onSearch, onFilterChange, placeholder = "비디오 검색..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    duration: 'all',
    group: [],
    sortBy: 'latest'
  })

  const platforms = ['YouTube', 'Instagram', 'TikTok']
  const groups = ['가족', '친구들', '팀 프로젝트', '일상', '요리', '힐링', '엔터테인먼트', '라이프스타일']
  const durations = [
    { value: 'all', label: '전체' },
    { value: 'short', label: '짧은 영상 (1분 이하)' },
    { value: 'medium', label: '중간 영상 (1-10분)' },
    { value: 'long', label: '긴 영상 (10분 이상)' }
  ]
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'views', label: '조회수순' },
    { value: 'likes', label: '좋아요순' }
  ]

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, onSearch])

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const togglePlatform = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }))
  }

  const toggleGroup = (group: string) => {
    setFilters(prev => ({
      ...prev,
      group: prev.group.includes(group)
        ? prev.group.filter(g => g !== group)
        : [...prev.group, group]
    }))
  }

  const clearFilters = () => {
    setFilters({
      platform: [],
      duration: 'all',
      group: [],
      sortBy: 'latest'
    })
  }

  const hasActiveFilters = filters.platform.length > 0 || 
                          filters.duration !== 'all' || 
                          filters.group.length > 0 || 
                          filters.sortBy !== 'latest'

  return (
    <div className="relative">
      {/* 검색바 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-20 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-soft"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {hasActiveFilters && (
            <div className="flex items-center space-x-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-lg text-xs">
              <Sparkles className="w-3 h-3" />
              <span>필터 적용됨</span>
            </div>
          )}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isFilterOpen 
                ? 'bg-primary-500 text-white shadow-glow' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 필터 패널 */}
      {isFilterOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-large z-50 animate-scale-in">
          <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">필터</h3>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    초기화
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 플랫폼 필터 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">플랫폼</h4>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.platform.includes(platform)
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* 그룹 필터 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">그룹</h4>
              <div className="flex flex-wrap gap-2">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => toggleGroup(group)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.group.includes(group)
                        ? 'bg-accent-500 text-white shadow-glow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* 재생 시간 필터 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">재생 시간</h4>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setFilters(prev => ({ ...prev, duration: duration.value }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.duration === duration.value
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 정렬 옵션 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">정렬</h4>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.sortBy === option.value
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 