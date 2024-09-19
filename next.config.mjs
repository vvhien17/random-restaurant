/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOONG_MAP_API_KEY: process.env.GOONG_MAP_API_KEY,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        SERVICE_ID: process.env.SERVICE_ID,
        TEMPLATE_ID: process.env.TEMPLATE_ID,
        PUBLIC_SERVICE_KEY: process.env.PUBLIC_SERVICE_KEY,
    }
};

export default nextConfig;
