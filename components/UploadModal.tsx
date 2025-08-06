'use client';

import { useState } from 'react';
import { X, Upload, Link, Loader2 } from 'lucide-react';
import { VideoUploadData } from '@/types/video';
import { videoAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded: () => void;
}

export default function UploadModal({ isOpen, onClose, onVideoUploaded }: UploadModalProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedVideo, setParsedVideo] = useState<VideoUploadData | null>(null);

  const handleUrlParse = async () => {
    if (!url.trim()) {
      toast.error('URL을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const videoData = await videoAPI.parseVideoUrl(url);
      setParsedVideo(videoData);
      toast.success('URL 파싱이 완료되었습니다!');
    } catch (error) {
      console.error('URL 파싱 실패:', error);
      toast.error('URL 파싱에 실패했습니다. 올바른 URL인지 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!parsedVideo) {
      toast.error('먼저 URL을 파싱해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await videoAPI.createVideo(parsedVideo);
      toast.success('비디오가 성공적으로 업로드되었습니다!');
      onVideoUploaded();
      handleClose();
    } catch (error) {
      console.error('비디오 업로드 실패:', error);
      toast.error('비디오 업로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setParsedVideo(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">비디오 업로드</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL 입력 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비디오 URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube, Instagram, TikTok URL을 입력하세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleUrlParse}
                disabled={isLoading || !url.trim()}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link className="w-4 h-4" />
                )}
                파싱
              </button>
            </div>
          </div>

          {/* 파싱된 비디오 정보 */}
          {parsedVideo && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">비디오 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={parsedVideo.title}
                    onChange={(e) => setParsedVideo({ ...parsedVideo, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    작성자
                  </label>
                  <input
                    type="text"
                    value={parsedVideo.author}
                    onChange={(e) => setParsedVideo({ ...parsedVideo, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    그룹
                  </label>
                  <select
                    value={parsedVideo.group}
                    onChange={(e) => setParsedVideo({ ...parsedVideo, group: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="가족">가족</option>
                    <option value="친구들">친구들</option>
                    <option value="팀 프로젝트">팀 프로젝트</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    재생 시간
                  </label>
                  <input
                    type="text"
                    value={parsedVideo.duration}
                    onChange={(e) => setParsedVideo({ ...parsedVideo, duration: e.target.value })}
                    placeholder="0:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={parsedVideo.description}
                  onChange={(e) => setParsedVideo({ ...parsedVideo, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 썸네일 미리보기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  썸네일
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={parsedVideo.thumbnail}
                    alt="Thumbnail"
                    className="w-32 h-20 object-cover rounded-lg border"
                  />
                  <input
                    type="url"
                    value={parsedVideo.thumbnail}
                    onChange={(e) => setParsedVideo({ ...parsedVideo, thumbnail: e.target.value })}
                    placeholder="썸네일 URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 업로드 버튼 */}
          {parsedVideo && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                업로드
              </button>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 