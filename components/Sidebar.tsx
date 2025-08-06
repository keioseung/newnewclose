'use client';

import { useState } from 'react';
import { 
  Home, 
  Users, 
  Heart, 
  Clock, 
  Star, 
  Folder, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onGroupSelect: (group: string) => void;
}

export default function Sidebar({ onGroupSelect }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: '전체', active: false, count: undefined },
    { icon: Users, label: '가족', active: false, count: undefined },
    { icon: Heart, label: '친구들', active: false, count: undefined },
    { icon: Folder, label: '팀 프로젝트', active: false, count: undefined },
    { icon: Star, label: '즐겨찾기', active: false, count: undefined },
    { icon: Clock, label: '최근', active: false, count: undefined },
  ];

  const handleItemClick = (label: string) => {
    onGroupSelect(label);
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary-600">CloseTube</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 메뉴 아이템들 */}
      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleItemClick(item.label)}
            className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
              item.active
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left ml-3">{item.label}</span>
                {item.count && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* 하단 설정 */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200">
        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">설정</span>}
        </button>
      </div>
    </div>
  );
} 