/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 경고: 빌드 시 ESLint 에러가 있어도 무시하고 배포를 강행합니다.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 경고: 빌드 시 타입 에러가 있어도 무시하고 배포를 강행합니다.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;