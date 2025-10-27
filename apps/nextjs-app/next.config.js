/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@teable/common-i18n',
    '@teable/core',
    '@teable/icons',
    '@teable/openapi',
    '@teable/sdk',
    '@teable/ui-lib',
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
