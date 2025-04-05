/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Change server port to avoid conflict with API server on port 3000
  serverOptions: {
    port: 3001,
  },
};

module.exports = nextConfig;
