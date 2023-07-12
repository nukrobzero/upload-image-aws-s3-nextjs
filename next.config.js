/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      `${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
    ],
  },
  env: {
    BUCKET_NAME: process.env.BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
  },
};

module.exports = nextConfig;
