/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['waterservices.usgs.gov', 'api.tidesandcurrents.noaa.gov'],
  },
}

module.exports = nextConfig
