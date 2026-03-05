/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  transpilePackages: ['three', '@react-three/fiber', 'framer-motion'],
};

export default nextConfig;
