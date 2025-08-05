/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['via.placeholder.com', 'img.youtube.com', 'i.ytimg.com'],
  },
}

module.exports = nextConfig 