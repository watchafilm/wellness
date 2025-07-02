import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.genfosis.com',
        port: '', // ถ้าไม่มี port เฉพาะเจาะจงก็เว้นว่างไว้
        pathname: '/**', // หรือระบุ path ที่แม่นยำกว่า เช่น '/images/**' ถ้าต้องการ
      },
    ],
  },
};

export default nextConfig;
