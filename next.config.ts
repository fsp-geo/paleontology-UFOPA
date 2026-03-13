import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      { source: '/', destination: '/stitch/home.html' },
      { source: '/dashboard', destination: '/stitch/dashboard-professor.html' },
      { source: '/dashboard/professor', destination: '/stitch/dashboard-professor.html' },
      { source: '/dashboard/aluno', destination: '/stitch/dashboard-aluno.html' },
      { source: '/prestacao-de-contas', destination: '/stitch/prestacao-de-contas.html' },
      { source: '/acesso-ao-portal-interno', destination: '/stitch/acesso-ao-portal-interno.html' },
      { source: '/acervo-digital-de-fosseis', destination: '/stitch/acervo-digital-de-fosseis.html' },
      { source: '/wiki-de-estudos-paleontologicos', destination: '/stitch/wiki-de-estudos-paleontologicos.html' },
    ];
  },
};

export default nextConfig;
