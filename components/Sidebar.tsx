'use client'

import { useState } from 'react'
import { 
  Home, 
  Video, 
  Heart, 
  Clock, 
  Users, 
  Plus, 
  UserPlus, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      section: '내 채널',
      items: [
        { icon: Home, label: '홈', active: true, count: undefined },
        { icon: Video, label: '내 영상', active: false, count: undefined },
        { icon: Heart, label: '좋아요', active: false, count: undefined },
        { icon: Clock, label: '시청 기록', active: false, count: undefined },
      ]
    },
    {
      section: '그룹',
      items: [
        { icon: Users, label: '가족', count: 4, active: false },
        { icon: Users, label: '친구들', count: 6, active: false },
        { icon: Users, label: '팀 프로젝트', count: 3, active: false },
      ]
    },
    {
      section: '도구',
      items: [
        { icon: Plus, label: '새 그룹 만들기', active: false, count: undefined },
        { icon: UserPlus, label: '멤버 초대', active: false, count: undefined },
        { icon: Settings, label: '설정', active: false, count: undefined },
      ]
    }
  ]

  return (
    <nav className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">CloseTube</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="flex-1 overflow-y-auto py-4">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button
                      className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                        item.active
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${
                        isCollapsed ? 'mx-auto' : 'mr-3'
                      }`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.count && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {item.count}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
} 