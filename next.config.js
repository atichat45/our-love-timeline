/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['react-leaflet'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'unpkg.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  // Configure external packages
  serverExternalPackages: ['leaflet'],
  experimental: {
    // Other experimental options can stay here
  },
};

module.exports = nextConfig; 