-- CloseTube Database Schema
-- Run this in your Supabase SQL editor
-- This will DROP existing tables and recreate them

-- Drop existing tables and functions (if they exist)
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS videos CASCADE;

-- Create videos table
CREATE TABLE videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    thumbnail TEXT,
    duration VARCHAR(10),
    author VARCHAR(100) NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    group_name VARCHAR(100) NOT NULL,
    privacy JSONB DEFAULT '{"downloadDisabled": true, "externalShareDisabled": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_videos_group ON videos(group_name);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON videos
    FOR SELECT USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON videos
    FOR INSERT WITH CHECK (true);

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON videos
    FOR UPDATE USING (true);

-- Create policy for authenticated users to delete
CREATE POLICY "Allow authenticated users to delete" ON videos
    FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data with better thumbnails
INSERT INTO videos (title, description, url, thumbnail, duration, author, group_name) VALUES
('가족 여행 하이라이트', '올해 여름 가족과 함께한 특별한 여행', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '3:24', '엄마', '가족'),
('파스타 만들기 클래스', '집에서 쉽게 만드는 맛있는 파스타', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', '8:15', '친구 민수', '친구들'),
('팀 프로젝트 브레인스토밍', '새로운 아이디어를 위한 팀 회의', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', '15:32', '팀장 지영', '팀 프로젝트'),
('자연 속 힐링 영상', '아름다운 자연 풍경과 함께하는 힐링 시간', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=180&fit=crop&crop=center', '5:42', '자연사랑', '힐링'),
('요리 레시피 모음', '집에서 쉽게 따라할 수 있는 요리 레시피', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=320&h=180&fit=crop&crop=center', '12:18', '요리왕', '요리');

-- Verify the table was created successfully
SELECT 'Table videos created successfully' as status;
SELECT COUNT(*) as total_videos FROM videos; 