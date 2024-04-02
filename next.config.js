/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  i18n: {
    locales: ["vi"],
    defaultLocale: "vi",
  },
  images: {
    unoptimized: true,
    domains: ["erp-demo.t-solution.vn", "erp.t-solution.vn"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
