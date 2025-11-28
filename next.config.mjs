/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Custom webpack config jika diperlukan
    return config;
  },
};

export default nextConfig;
