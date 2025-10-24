/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Netlify deployment
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Enable server actions
  experimental: {
    serverActions: true
  },
  
  // External packages for server components
  serverExternalPackages: ['bcryptjs', '@prisma/client'],
  
  // Disable Edge Runtime for middleware to reduce bundle size
  experimental: {
    serverActions: true,
    // Disable middleware for now to avoid Edge Function size limit
    middleware: false
  },
  
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
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // This makes sure that certain Node.js modules are properly bundled
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
    return config;
  },
}

module.exports = nextConfig
