/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'images.unsplash.com'],
  },
}

module.exports = nextConfig
