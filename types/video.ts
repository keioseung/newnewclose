export interface Video {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  duration: string
  author: string
  views: number
  likes: number
  comments: number
  createdAt: string
  group: string
  privacy: {
    downloadDisabled: boolean
    externalShareDisabled: boolean
  }
}

export interface Comment {
  id: string
  author: string
  authorAvatar: string
  text: string
  createdAt: string
}

export interface Group {
  id: string
  name: string
  memberCount: number
  icon: string
}

export interface VideoUploadData {
  title: string
  description: string
  url: string
  thumbnail: string
  duration: string
  author: string
  group: string
  privacy: {
    downloadDisabled: boolean
    externalShareDisabled: boolean
  }
} 