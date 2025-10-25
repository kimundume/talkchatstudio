/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export for now - required for API routes and auth
  // output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure server actions
  experimental: {
    serverActions: {
      // Allow server actions in client components
      allowedOrigins: ['*'],
    },
    // Disable middleware for now to avoid Edge Function size limit
    middleware: false
  },
  
  // External packages for server components
  serverExternalPackages: ['bcryptjs', '@prisma/client'],
  
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
}

module.exports = nextConfig
