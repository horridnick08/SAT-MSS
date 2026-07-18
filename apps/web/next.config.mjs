/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript type-checking during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Custom webpack configuration for Cesium
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure Cesium assets are copied or accessible if needed
    }
    return config;
  },
};

export default nextConfig;
