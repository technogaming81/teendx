/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@teendx/database', '@teendx/shared-types'],
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
