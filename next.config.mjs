/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We explicitly transpile three.js to prevent "WebGLCubeRenderTarget" import errors
  transpilePackages: ['three', '@react-three/fiber', 'framer-motion'],
};

export default nextConfig;
