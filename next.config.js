/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
    // Disable middleware for now to avoid Edge Function size limit
    middleware: false,
    // External packages for server components
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  
  // Disable Edge Runtime by default
  runtime: 'nodejs',
  
  // Configure webpack for browser compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
      };
    }
    return config;
  },
  
  // Ignore TypeScript and ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable React Strict Mode for better compatibility
  reactStrictMode: false,
}

module.exports = nextConfig
