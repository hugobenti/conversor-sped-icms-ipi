/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb', 
    },
  },
};

module.exports = nextConfig;
