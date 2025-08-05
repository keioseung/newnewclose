'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Upload, Link, Check } from 'lucide-react'
import { VideoUploadData } from '@/types/video'
import { videoApi, urlApi } from '../lib/api'
import toast from 'react-hot-toast'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [parsedVideo, setParsedVideo] = useState<any>(null)
  const [isUrlValid, setIsUrlValid] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VideoUploadData>()

  const watchedUrl = watch('url')

  // URL 유효성 검사
  const validateUrl = async (url: string) => {
    if (!url) {
      setIsUrlValid(false)
      setParsedVideo(null)
      return
    }

    try {
      const videoInfo = await urlApi.parseVideoUrl(url)
      setParsedVideo(videoInfo)
      setIsUrlValid(true)
      
      // 자동으로 제목과 썸네일 설정
      if (videoInfo.title) {
        setValue('title', videoInfo.title)
      }
    } catch (error) {
      setIsUrlValid(false)
      setParsedVideo(null)
    }
  }

  const onSubmit = async (data: VideoUploadData) => {
    if (!isUrlValid) {
      toast.error('유효한 영상 URL을 입력해주세요')
      return
    }

    setIsLoading(true)
    try {
      await videoApi.upload(data)
      toast.success('영상이 성공적으로 업로드되었습니다!')
      reset()
      setParsedVideo(null)
      setIsUrlValid(false)
      onClose()
    } catch (error) {
      toast.error('영상 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">새 영상 업로드</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 본문 */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* URL 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              영상 URL
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="YouTube, Instagram, TikTok 등의 영상 URL을 입력하세요"
                {...register('url', { 
                  required: 'URL을 입력해주세요',
                  onChange: (e) => validateUrl(e.target.value)
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.url ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {isUrlValid && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
            )}
          </div>

          {/* 파싱된 비디오 정보 */}
          {parsedVideo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={parsedVideo.thumbnail}
                  alt="썸네일"
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{parsedVideo.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{parsedVideo.duration}</p>
                </div>
              </div>
            </div>
          )}

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              placeholder="영상 제목을 입력하세요"
              {...register('title', { required: '제목을 입력해주세요' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              placeholder="영상에 대한 설명을 입력하세요"
              rows={3}
              {...register('description')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* 공유 그룹 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공유 그룹
            </label>
            <select
              {...register('group', { required: '그룹을 선택해주세요' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.group ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">그룹을 선택하세요</option>
              <option value="전체">전체</option>
              <option value="가족">가족</option>
              <option value="친구들">친구들</option>
              <option value="팀 프로젝트">팀 프로젝트</option>
            </select>
            {errors.group && (
              <p className="mt-1 text-sm text-red-600">{errors.group.message}</p>
            )}
          </div>

          {/* 프라이버시 설정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              프라이버시 설정
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('privacy.downloadDisabled')}
                  defaultChecked
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">다운로드 금지</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('privacy.externalShareDisabled')}
                  defaultChecked
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">외부 공유 금지</span>
              </label>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !isUrlValid}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>업로드 중...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>업로드</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 