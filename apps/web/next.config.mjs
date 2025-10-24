/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@teendx/shared-types'],
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
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
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
