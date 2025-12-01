import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

// Custom domain - client-side navigation uses window.location.hostname
const CUSTOM_DOMAIN = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN || 'www.chriszombik.com'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Vercel project URL (used by server-side rendering)
      ...[NEXT_PUBLIC_SERVER_URL].filter(Boolean).map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      // Custom domain (used by client-side navigation)
      {
        hostname: CUSTOM_DOMAIN,
        protocol: 'https',
      },
      // Non-www version of custom domain
      {
        hostname: CUSTOM_DOMAIN.replace('www.', ''),
        protocol: 'https',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  serverActions: {
    bodySizeLimit: '20mb',
  },
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
